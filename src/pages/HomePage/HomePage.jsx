import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>
        <button onClick={() => navigate('/catalog')}>View Catalog</button>
      </div>
    </section>
  );
};

export default HomePage;
