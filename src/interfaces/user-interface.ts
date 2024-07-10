import mongoose from "../utility/db.js";
import { UserRole } from "../utility/permissions.js";

interface IUserBase {
  email: string;
  role?: UserRole;
  name: string;
  surname: string;
}

export interface IUserPassport extends IUserBase {
  _id: string;
  created: string;
}

export interface User extends IUserBase {
  _id: string;
  created: string;
}

// export interface IUserDb extends IUserPassport {
//   password: string;
// }

export interface IUserInsert extends IUserBase {
  password: string;
}


export default interface IUser extends IUserBase {
  id: number;
  password: string;

}

export type IUserUpdate = Partial<IUser>;

export interface IUserDb extends mongoose.Document , IUserBase {
  _id: mongoose.Types.ObjectId;
  password: string;
  validPassword(password: string): Promise<boolean>;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
