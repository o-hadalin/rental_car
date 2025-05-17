import { NavLink, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  const location = useLocation();

  // Якщо ми зараз у каталозі або деталях авто — беремо search для переходу назад з фільтрами
  const catalogSearch = location.pathname.startsWith('/catalog')
    ? location.search
    : '';

  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Home
      </NavLink>
      <NavLink
        to={`/catalog${catalogSearch}`}
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Catalog
      </NavLink>
    </nav>
  );
};

export default Navigation;
