import { createContext, useEffect, useMemo, useState } from 'react';
import { parseCookies } from 'nookies';
import { User } from '.prisma/client';
import axios, { AxiosError } from 'axios';

import { api } from '../services/api';
import { AUTH_TOKEN } from '../utils/constants';
import LoginRequest from '../pages/api/user/types/LoginRequest';
import LoginResponse from '../pages/api/user/types/LoginResponse';
import RegisterRequest from '../pages/api/user/types/RegisterRequest';
import RegisterResponse from '../pages/api/user/types/RegisterResponse';
import TokenResponse from '../pages/api/user/types/TokenResponse';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const getUserFromToken = async () => {
      setLoading(true);
      const { [AUTH_TOKEN]: token } = parseCookies();

      if (token) {
        try {
          const {
            data: { user }
          } = await api.post<TokenResponse>('/api/user/from-token', {
            token
          });
          setUser(user);
        } catch (_) {}
      }

      setLoading(false);
    };

    getUserFromToken();
  }, []);

  const login = async ({ email, password }: LoginRequest) => {
    setLoading(true);
    try {
      const {
        data: { user }
      } = await api.post<LoginResponse>('/api/user/login', {
        email,
        password
      });
      const { [AUTH_TOKEN]: token } = parseCookies();
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        throw new Error((error.response?.data as TokenResponse).error);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async ({
    firstName,
    lastName,
    email,
    password
  }: RegisterRequest) => {
    setLoading(true);
    try {
      const {
        data: { user }
      } = await api.post<RegisterResponse>('/api/user/register', {
        email,
        password,
        firstName,
        lastName
      });
      const { [AUTH_TOKEN]: token } = parseCookies();
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      const error = err as Error | AxiosError;
      if (axios.isAxiosError(error)) {
        throw new Error((error.response?.data as RegisterResponse).error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api
      .post('/api/user/logout')
      .then(() => {
        setUser(null);
      })
      .catch(() => console.error('An error occurred'));
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      user
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
