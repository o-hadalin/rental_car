import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import CatalogPage from './pages/CatalogPage/CatalogPage.jsx';
import DetailsPage from './pages/DetailsPage/DetailsPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="catalog" element={<CatalogPage />} />
      <Route path="/catalog/:id" element={<DetailsPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
