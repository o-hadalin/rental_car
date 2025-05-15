import { Outlet } from 'react-router-dom';
import AppBar from '../AppBar/AppBar';

const Layout = () => (
  <>
    <AppBar />
    <Outlet />
  </>
);

export default Layout;
