import type { IUserModel } from 'src/models/user.model';
import client from './client.api';
import type { ILoginResponse } from './models/auth.model';

export const login = async (username: string, password: string) => {
  const response = await client.post<ILoginResponse>('/api/auth/local', {
    identifier: username,
    password: password,
  });
  const { jwt, user } = response.data;

  localStorage.setItem('tpearl:auth:token', jwt);
  return user;
};

export const getMe = async () => {
  const response = await client.get<IUserModel>('/api/users/me');
  return response.data;
};
