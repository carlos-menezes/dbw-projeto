import { createContext, useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { User } from '.prisma/client';
import Router from 'next/router';
import { AxiosError } from 'axios';
import jwt_decode from 'jwt-decode';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../types/';
import { api } from '../services/api';
import { AUTH_TOKEN } from '../utils/constants';

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
      const { user } = jwt_decode<{ user: User }>(token);
      setUser(user);
    }
  }, []);

  const login = async ({ email, password }: LoginRequest) => {
    await api
      .post<LoginResponse>('/api/user/login', {
        email,
        password
      })
      .then(({ data: { authToken } }) => {
        setCookie(undefined, AUTH_TOKEN, authToken, {
          maxAge: 60 * 60 * 1
        });
        api.defaults.headers['Authorization'] = `Bearer ${authToken}`;
        const user = jwt_decode<User>(authToken);
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
    destroyCookie(undefined, AUTH_TOKEN);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, error, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
