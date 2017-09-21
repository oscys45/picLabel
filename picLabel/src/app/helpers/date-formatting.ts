
import * as moment from 'moment';

export class DateFormatHelper {

  /**
   * Convert Exif YYYY:MM:DD format to javascript format.
   * @param {string} exifDate
   * @returns {Date}
   */
  public static exifDateToPickerDate(exifDate: string): any {
    if (exifDate) {
      return {
        date: {
          year: parseInt(exifDate.substring(0, 4)),
          month: parseInt(exifDate.substring(5, 7)),
          day: parseInt(exifDate.substring(8, 10))
        }
      };
    } else {
      return {
        date: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        }
      };
    }
  }

  public static pickerDateToExifDate(pickerDate: any): string {

    return moment(new Date(pickerDate.date.month + "/" +
      pickerDate.date.day + "/" +
      pickerDate.date.year)).format('YYYY:MM:DD hh:mm:ss');
  }

}
