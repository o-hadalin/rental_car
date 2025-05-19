import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from './CatalogPage.module.css';
import Filters from '../../components/Filters/Filters.jsx';
import CarList from '../../components/CarList/CarList.jsx';
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton.jsx';
import {
  setBrand,
  setPrice,
  setMileageFrom,
  setMileageTo,
} from '../../redux/filters/slice';
import { setLastSearch } from '../../redux/catalogState/slice';
import { resetCars } from '../../redux/cars/slice';
import { fetchCars } from '../../redux/cars/operations';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!location.search) {
      const saved = localStorage.getItem('rentalCarFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        const params = new URLSearchParams();
        if (parsed.brand) params.set('brand', parsed.brand);
        if (parsed.price) params.set('price', parsed.price);
        if (parsed.mileageFrom) params.set('minMileage', parsed.mileageFrom);
        if (parsed.mileageTo) params.set('maxMileage', parsed.mileageTo);
        window.history.replaceState(null, '', `/catalog?${params.toString()}`);
      }
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get('brand') || '';
    const price = params.get('price') || '';
    const minMileage = params.get('minMileage') || '';
    const maxMileage = params.get('maxMileage') || '';

    dispatch(setLastSearch(location.search));
    dispatch(setBrand(brand));
    dispatch(setPrice(price));
    dispatch(setMileageFrom(minMileage));
    dispatch(setMileageTo(maxMileage));

    setTimeout(() => {
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
    }, 0); // 🔧 затримка в один event loop
  }, [dispatch, location.search]);

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
