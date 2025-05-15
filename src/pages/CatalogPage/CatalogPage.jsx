import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './CatalogPage.module.css';
import Filters from '../../components/Filters/Filters.jsx';
import CarList from '../../components/CarList/CarList.jsx';
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton.jsx';
import { fetchCars } from '../../redux/cars/operations';
import { resetCars } from '../../redux/cars/slice';

const CatalogPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCars());
    dispatch(fetchCars({ page: 1, limit: 12 }));
  }, [dispatch]);

  return (
    <main className={styles.catalogPage}>
      <div className={styles.container}>
        <Filters />
        <CarList />
        <LoadMoreButton />
      </div>
    </main>
  );
};

export default CatalogPage;
