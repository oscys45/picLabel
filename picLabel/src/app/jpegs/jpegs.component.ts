import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DateFormatHelper } from "../helpers/date-formatting";
import { ConversionHelper } from "../helpers/conversion";

import { FileService } from '../services/file.service';
import { AuthService } from '../services/auth.service';

import { Jpeg } from '../models/jpeg';

import { IMyDpOptions } from 'mydatepicker';
import * as JSZip from 'jszip';
import * as piexif from 'piexifjs';
import * as FileSaver from 'file-saver';
import * as blobUtil from 'blob-util';

// TODO:  Gallery should be a component.

@Component({
  selector: 'jpegs',
  templateUrl: './jpegs.component.html',
  styleUrls: ['./jpegs.component.css'],
  providers: [ FileService ]
})
export class JpegsComponent {

  private userFiles: Observable<Array<Jpeg>>;
  private userFileValues: Array<Jpeg> = [];
  private filesToUpload: Array<Jpeg> = [];
  private selectedFile: Jpeg = new Jpeg();
  private checkboxMap: Map<string, any> = new Map<string, any>();

  /**
   * Options for date picker control.
   * @type {{editableDateField: boolean; dateFormat: string}}
   */
  private myDatePickerOptions: IMyDpOptions = {
    editableDateField: false,
    dateFormat: 'mm/dd/yyyy'
  };

  /**
   * Constructor
   * @param {FileService} fileService
   */
  constructor(private authService: AuthService,
              private fileService: FileService) {
    this.populateFiles();
  }

  /**
   * New file added to upload queue.
   * @param $event
   */
  private imageUploaded($event) : void {

    let fileToSend: Jpeg = new Jpeg();

    fileToSend.accountId = this.authService.userProfile._id;
    fileToSend.name = $event.file.name;
    fileToSend.lastModified = $event.file.lastModified;
    fileToSend.lastModifiedDate = $event.file.lastModifiedDate;
    fileToSend.type = $event.file.type;
    fileToSend.src = $event.src;

    this.filesToUpload.push(<Jpeg>fileToSend);
  }

  private imageRemoved($event) : void {
    //this.filesToUpload.splice(1,1);
  }

  /**
   * Post uploaded image array to server for saving.
   */
  private uploadImages() : void {

    this.filesToUpload.forEach((x) => {
        this.fileService.pushFile(x).subscribe((result: any) => {
          // Add'im to list.
          // TODO:  List should be listening for changes.  We should NOT re-populate with every upload.
          this.populateFiles();
        });
      });
    this.filesToUpload = [];
  }

  /**
   * User selected image in the gallery, set the class variable selectedFile to that image.
   * @param image
   */
  private setSelectedImage(image: Jpeg): void {

    this.selectedFile = image;
    this.selectedFile.exif = piexif.load(image.src);

    let exifDict = piexif.load(image.src);

    console.log(exifDict);

    this.selectedFile.exif.title = exifDict["0th"][piexif.ImageIFD.ImageDescription];
    this.selectedFile.exif.authors = exifDict["0th"][piexif.ImageIFD.Artist];
    this.selectedFile.exif.rating = exifDict["0th"][piexif.ImageIFD.Rating];
    this.selectedFile.exif.dateTaken = DateFormatHelper.exifDateToPickerDate(exifDict["Exif"][piexif.ExifIFD.DateTimeOriginal]);
    // DateTimeDigitized is NOT the same as Date acquired in Windows.  Unsure of the Exif offset for that or if piexif supports it.
    this.selectedFile.exif.dateAcquired = DateFormatHelper.exifDateToPickerDate(exifDict["Exif"][piexif.ExifIFD.DateTimeDigitized]);
    this.selectedFile.exif.comments = ConversionHelper.bin2String(exifDict["0th"][piexif.ImageIFD.XPComment]);
    this.selectedFile.exif.subject = ConversionHelper.bin2String(exifDict["0th"][piexif.ImageIFD.XPSubject]);
    this.selectedFile.exif.tags = ConversionHelper.bin2String(exifDict["0th"][piexif.ImageIFD.XPKeywords]);
  }

  /**
   * Update selectedFile Exifs in database.
   */
  private saveImage(): void {

    // load selected image, get Exifs.
    let exifDict = piexif.load(this.selectedFile.src);

    // Set Exifs.
    exifDict["0th"][piexif.ImageIFD.ImageDescription] = this.selectedFile.exif.title;
    exifDict["0th"][piexif.ImageIFD.XPTitle] = ConversionHelper.string2Bin(this.selectedFile.exif.title);
    exifDict["0th"][piexif.ImageIFD.Artist] = this.selectedFile.exif.authors;
    exifDict["0th"][piexif.ImageIFD.Rating] = this.selectedFile.exif.rating;
    exifDict["Exif"][piexif.ExifIFD.DateTimeOriginal] = DateFormatHelper.pickerDateToExifDate(this.selectedFile.exif.dateTaken);
    exifDict["Exif"][piexif.ExifIFD.DateTimeDigitized] = DateFormatHelper.pickerDateToExifDate(this.selectedFile.exif.dateAcquired);
    exifDict["0th"][piexif.ImageIFD.XPComment] = ConversionHelper.string2Bin(this.selectedFile.exif.comments);
    exifDict["0th"][piexif.ImageIFD.XPSubject] = ConversionHelper.string2Bin(this.selectedFile.exif.subject);
    exifDict["0th"][piexif.ImageIFD.XPKeywords] = ConversionHelper.string2Bin(this.selectedFile.exif.tags);
    // TODO:  Not implemented.
    exifDict["GPS"][piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];

    let exifStr = piexif.dump(exifDict);

    this.selectedFile.src = piexif.insert(exifStr, this.selectedFile.src);
    this.selectedFile.name = (this.selectedFile.name.includes(".jpg") ? this.selectedFile.name : this.selectedFile.name + ".jpg");

    this.fileService.updateFile(this.selectedFile);
  }

  /**
   * Download file to client.
   */
  private downloadImage(file: Jpeg): void {
    blobUtil.base64StringToBlob(this.selectedFile.src.replace("data:image/jpeg;base64,", "")).then((blob) => { FileSaver.saveAs(blob, file.name); });
  }

  /**
   * Download selected files to client as a ZIP.
   */
  private downloadSelectedImages(): void {

    let zip = new JSZip();
    let zipPromiseArray = new Array<Promise<any>>();

    // Traverse each file.
    this.userFileValues.forEach((x) => {
      // Is it selected?
      if (this.checkboxMap.get(x._id).selected) {
        // Convert it to BLOB (and add to promise array).
        zipPromiseArray.push(blobUtil.base64StringToBlob(x.src.replace("data:image/jpeg;base64,", ""))
          .then((blob) => {
            // Add to zip
            zip.file(x.name, blob);
          })
        );
        this.checkboxMap.set(x._id, {selected : false});
      }
    });

    // All files added?  Send that zip.
    Promise.all(zipPromiseArray).then(() => {
        zip.generateAsync({type: "blob"})
          .then((zipBlob) => {
            FileSaver.saveAs(zipBlob, "multis.zip");
          });
      });
  }

  /**
   * Select or deselect all images in checkboxMap.
   * @param {boolean} select
   */
  private selectAll(select: boolean): void {
    this.checkboxMap.forEach((val, key, map) => {
      val.selected = select;
    });
  }

  /**
   * Return true if any image is selected.
   * Sucks because it's a linear search.
   * @returns {boolean}
   */
  private get hasSelectedFiles(): boolean {

    let result: boolean = false;

    this.checkboxMap.forEach((val, key, map) => {
      if (val.selected) {
        result = true;
      }
    });

    return result;
  }

  /**
   * Navigate through pictures in the gallery in the modal.
   * @param {boolean} forward
   */
  private navigate(forward: boolean): void {

    let index = this.userFileValues.indexOf(this.selectedFile) + (forward ? 1 : -1);

    if (index == 0) {
      index = 1;
    } else if ((index > 0) && (index <= 0) && forward) {
      index = this.userFileValues.indexOf(this.selectedFile) + 1;
    } else if ((index > 0) && (index <= 0) && !forward) {
      index = this.userFileValues.indexOf(this.selectedFile) - 1;
    }

    if (index >= 0 && index <  this.userFileValues.length) {
      this.setSelectedImage(this.userFileValues[index]);
    }
  }

  /**
   * Query server for images, set to class array.
   */
  private populateFiles(): void {

    // Get files.
    //let fileGetOperation = this.fileService.getAllFiles();
    this.userFiles = this.fileService.getAllFiles();

    //fileGetOperation.subscribe((result: Jpeg[]) => {
    this.userFiles.subscribe((result: Jpeg[]) => {
        this.userFileValues = result;

        // Set the checkbox map.
        result.forEach((x) => {
          this.checkboxMap.set(x._id, { display: false, selected: false })
        });
      },
      (err) => {
        this.userFiles = err.message;
        // Log errors if any
        console.log(err);
      });
  }
}
