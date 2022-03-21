import Navigation from './Navigation';
import Footer from './Footer';
import { CSSProperties } from 'react';

const mainStyle: CSSProperties = {
  minHeight: 'calc(100vh - 6rem)'
};

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <main style={mainStyle}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
