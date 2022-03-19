import React from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';

import '../styles.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
);

export default App;
