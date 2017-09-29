import { baseModel } from './base-model'

export class User extends baseModel{
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  roles: string[];
}
