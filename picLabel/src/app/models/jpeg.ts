import { baseModel } from './base-model'

export class Exif {
  title: string;
  subject: string;
  rating: number;
  comments: string;
  authors: string;
  dateTaken: any;  // Product of proprietary date type used by date picker.
  dateAcquired: any;
}

export class Jpeg extends baseModel {
  accountId: any;
  src: string;
  thumbSrc: string;
  name: string;
  exif: Exif = new Exif();
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
}
