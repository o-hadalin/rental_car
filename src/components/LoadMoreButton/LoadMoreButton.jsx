import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../../redux/cars/operations';
import {
  selectPage,
  selectHasMore,
  selectIsLoading,
} from '../../redux/cars/selectors';

const LoadMoreButton = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const hasMore = useSelector(selectHasMore);
  const isLoading = useSelector(selectIsLoading);

  const handleClick = () => {
    if (hasMore && !isLoading) {
      dispatch(fetchCars({ page: page + 1 }));
    }
  };

  if (!hasMore) return null;

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
};

export default LoadMoreButton;
