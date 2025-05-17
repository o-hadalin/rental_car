import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLastSearch } from '../../redux/filters/selectors';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const lastSearchFromStore = useSelector(selectLastSearch);
  const lastSearchFromStorage = localStorage.getItem('lastSearch') || '';
  const lastSearch = lastSearchFromStore || lastSearchFromStorage;

  const handleNavigate = () => {
    navigate(`/catalog${lastSearch}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>
        <button onClick={handleNavigate}>View Catalog</button>
      </div>
    </section>
  );
};

export default HomePage;
