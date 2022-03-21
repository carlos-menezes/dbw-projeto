import Navigation from './Navigation';
import styled from 'styled-components';
import Footer from './Footer';

const Content = styled.div``;

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <Content>{children}</Content>
      <Footer />
    </>
  );
};

export default Layout;
