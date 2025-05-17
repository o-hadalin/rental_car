import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../../redux/cars/operations';
import Loader from '../Loader/Loader';
import {
  selectPage,
  selectHasMore,
  selectIsLoading,
} from '../../redux/cars/selectors';
import {
  selectBrand,
  selectPrice,
  selectMileageFrom,
  selectMileageTo,
} from '../../redux/filters/selectors';
import styles from './LoadMoreButton.module.css';

const LoadMoreButton = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const hasMore = useSelector(selectHasMore);
  const isLoading = useSelector(selectIsLoading);

  const brand = useSelector(selectBrand);
  const rentalPrice = useSelector(selectPrice);
  const minMileage = useSelector(selectMileageFrom);
  const maxMileage = useSelector(selectMileageTo);

  const handleClick = () => {
    if (hasMore && !isLoading) {
      dispatch(
        fetchCars({
          page: page + 1,
          limit: 12,
          brand,
          rentalPrice,
          minMileage,
          maxMileage,
        })
      );
    }
  };

  if (!hasMore) return null;

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <button onClick={handleClick}>Load more</button>
      )}
    </div>
  );
};

export default LoadMoreButton;
