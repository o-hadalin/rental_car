import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCars } from '../../redux/cars/operations';
import { resetCars } from '../../redux/cars/slice';
import { selectCars, selectIsLoading } from '../../redux/cars/selectors.js';
import {
  selectBrand,
  selectPrice,
  selectMileageFrom,
  selectMileageTo,
} from '../../redux/filters/selectors.js';
import CarCard from '../CarCard/CarCard';
import styles from './CarList.module.css';

const CarList = () => {
  const dispatch = useDispatch();

  const cars = useSelector(selectCars);
  const isLoading = useSelector(selectIsLoading);

  // Витягуємо фільтри з редакса, щоб передати їх в запит
  const brand = useSelector(selectBrand);
  const rentalPrice = useSelector(selectPrice);
  const minMileage = useSelector(selectMileageFrom);
  const maxMileage = useSelector(selectMileageTo);

  useEffect(() => {
    console.log({ brand, rentalPrice, minMileage, maxMileage });
    dispatch(resetCars());
    dispatch(
      fetchCars({
        page: 1,
        limit: 12,
        brand,
        rentalPrice,
        minMileage,
        maxMileage,
      })
    );
  }, [dispatch, brand, rentalPrice, minMileage, maxMileage]);

  if (isLoading && cars.length === 0) {
    // Показати спінер лише при початковому завантаженні (коли ще немає машин)
    return <div className={styles.spinner} />;
  }

  if (cars.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        Nothing found. Please change your search parameters.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {cars.map(car => (
        <li key={car.id}>
          <CarCard car={car} />
        </li>
      ))}
    </ul>
  );
};

export default CarList;
