import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLastSearch } from '../../redux/catalogState/selectors';
import styles from './Navigation.module.css';

const Navigation = () => {
  const lastSearch = useSelector(selectLastSearch);
  const catalogLink = lastSearch ? `/catalog${lastSearch}` : '/catalog';

  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Home
      </NavLink>
      <NavLink
        to={catalogLink}
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Catalog
      </NavLink>
    </nav>
  );
};

export default Navigation;
