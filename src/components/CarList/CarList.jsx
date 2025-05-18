import { useSelector } from 'react-redux';
import { selectCars } from '../../redux/cars/selectors';
import CarCard from '../CarCard/CarCard';
import styles from './CarList.module.css';

const CarList = () => {
  const cars = useSelector(selectCars);

  if (cars.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        Nothing found. Please change your search parameters.{' '}
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
