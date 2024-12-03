import { IUser } from "../models/user.model";

export interface ILogin {
  password: string;
  email: string;
}

export interface ILoginServiceResult {
  user: IUser;
  token: string;
}
