import { Outlet } from 'react-router-dom';
import AppBar from '../AppBar/AppBar';
import { Toaster } from 'react-hot-toast';

const Layout = () => (
  <>
    <AppBar />
    <Outlet />
    <Toaster position="top-right" />
  </>
);

export default Layout;
