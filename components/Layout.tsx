import { Layout as AntLayout, Menu, Breadcrumb, Row, Col, Avatar } from 'antd';
import Navigation from './Navigation';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
    </>
  );
};

export default Layout;
