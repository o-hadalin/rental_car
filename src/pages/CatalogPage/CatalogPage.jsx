import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import styles from './CatalogPage.module.css';
import Filters from '../../components/Filters/Filters.jsx';
import CarList from '../../components/CarList/CarList.jsx';
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton.jsx';
import { fetchCars } from '../../redux/cars/operations';
import { resetCars } from '../../redux/cars/slice';
import {
  setBrand,
  setPrice,
  setMileageFrom,
  setMileageTo,
} from '../../redux/filters/slice';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Читаємо параметри фільтрів з URL
    const brand = searchParams.get('brand') || '';
    const price = searchParams.get('price') || '';
    const minMileage = searchParams.get('minMileage') || '';
    const maxMileage = searchParams.get('maxMileage') || '';

    // Встановлюємо фільтри в Redux
    dispatch(setBrand(brand));
    dispatch(setPrice(price));
    dispatch(setMileageFrom(minMileage));
    dispatch(setMileageTo(maxMileage));

    // Скидаємо список авто та робимо запит з фільтрами

    dispatch(resetCars());
    dispatch(
      fetchCars({
        page: 1,
        limit: 12,
        brand,
        rentalPrice: price,
        minMileage,
        maxMileage,
      })
    );
  }, [dispatch, searchParams]);

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
