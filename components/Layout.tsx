import Navigation from './Navigation';
import Footer from './Footer';
import { CSSProperties } from 'react';
import Head from 'next/head';

const mainStyle: CSSProperties = {
  minHeight: 'calc(100vh - 7.2em)',
  padding: 50
};

type LayoutProps = {
  title: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} | ProtonX Help</title>
      </Head>
      <Navigation />
      <main style={mainStyle}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
