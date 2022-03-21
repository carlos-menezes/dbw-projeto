import { createContext, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { User } from '.prisma/client';
import Router from 'next/router';
import { AxiosError } from 'axios';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../types/';
import { api } from '../services/api';
import { AUTH_TOKEN } from '../utils/constants';
import { verifyJWT } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { [AUTH_TOKEN]: token } = parseCookies();

    if (token) {
      const { user } = verifyJWT(token) as JwtPayload;
      setUser(user);
    }
  }, []);

  const login = async ({ email, password }: LoginRequest) => {
    await api
      .post<LoginResponse>('/api/user/login', {
        email,
        password
      })
      .then(({ data: { user } }) => {
        const { [AUTH_TOKEN]: token } = parseCookies();
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        setUser(user);
      })
      .catch((error: AxiosError<LoginResponse>) => {
        setError(error.response!.data.message);
      });
  };

  const register = async ({
    firstName,
    lastName,
    email,
    password
  }: RegisterRequest) => {
    await api
      .post<RegisterResponse>('/api/user/register', {
        firstName,
        lastName,
        email,
        password
      })
      .then(() => {
        Router.push('/login');
      })
      .catch((error: AxiosError<RegisterResponse>) => {
        setError(error.response!.data.message);
      });
  };

  const logout = async () => {
    await api
      .post('/api/user/logout')
      .then(() => {
        setUser(null);
      })
      .catch(() => console.error('An error occurred'));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, error, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
