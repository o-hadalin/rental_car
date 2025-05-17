import Navigation from '../Navigation/Navigation';
import styles from './AppBar.module.css';
import logo from '../../assets/logo.svg';

const AppBar = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <img src={logo} alt="RentalCar logo" />
    </div>
    <Navigation />
  </header>
);

export default AppBar;
