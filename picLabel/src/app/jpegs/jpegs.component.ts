import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DateFormatHelper } from "../helpers/date-formatting";
import { ConversionHelper } from "../helpers/conversion";

import { FileService } from '../services/file.service';
import { AuthService } from '../services/auth.service';

import { Jpeg } from '../models/jpeg';

import { IMyDpOptions } from 'mydatepicker';
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
  private setSelectedImage(image): void {

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

    this.fileService.updateFile((this.selectedFile));
  }

  /**
   * Download file to client.
   */
  private downloadImage(): void {
    blobUtil.base64StringToBlob(this.selectedFile.src.replace("data:image/jpeg;base64,", "")).then((blob) => { FileSaver.saveAs(blob, this.selectedFile.name); });
  }

  /**
   * Navigate through pictures in the gallery in the modal.
   * @param {boolean} forward
   */
  private navigate(forward: boolean) {

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
        //this.userFiles = result;
        this.userFileValues = result;
      },
      (err) => {
        this.userFiles = err.message;
        // Log errors if any
        console.log(err);
      });
  }
}
