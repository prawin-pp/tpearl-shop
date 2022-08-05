import type { IUserModel } from 'src/models/user.model';

export interface ILoginResponse {
  jwt: string;
  user: IUserModel;
}
