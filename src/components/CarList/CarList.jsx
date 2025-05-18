import { useSelector } from 'react-redux';
import { selectCars, selectIsLoading } from '../../redux/cars/selectors.js';
import { selectIsFiltered } from '../../redux/filters/selectors.js';
import CarCard from '../CarCard/CarCard';
import styles from './CarList.module.css';

const CarList = () => {
  const cars = useSelector(selectCars);
  const isLoading = useSelector(selectIsLoading);
  const isFiltered = useSelector(selectIsFiltered);

  if (isLoading) {
    return <div className={styles.spinner} />;
  }

  if (cars.length === 0 && isFiltered) {
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
