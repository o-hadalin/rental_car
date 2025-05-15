import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => (
  <nav className={styles.nav}>
    <NavLink
      to="/"
      className={({ isActive }) => (isActive ? styles.active : styles.link)}
    >
      Home
    </NavLink>
    <NavLink
      to="/catalog"
      className={({ isActive }) => (isActive ? styles.active : styles.link)}
    >
      Catalog
    </NavLink>
  </nav>
);

export default Navigation;
