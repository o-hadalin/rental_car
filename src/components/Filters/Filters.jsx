import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  setBrand,
  setPrice,
  setMileageFrom,
  setMileageTo,
} from '../../redux/filters/slice';
import {
  selectBrand,
  selectPrice,
  selectMileageFrom,
  selectMileageTo,
} from '../../redux/filters/selectors';
import { selectIsFiltered } from '../../redux/filters/selectors';
import { resetCars } from '../../redux/cars/slice';
import { fetchCars } from '../../redux/cars/operations';
import { setLastSearch } from '../../redux/catalogState/slice';
import styles from './Filters.module.css';
import CustomSelect from '../CustomSelect/CustomSelect';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'rentalCarFilters';

const Filters = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoAppliedRef = useRef(false);

  // Локальний стан для форми
  const [brand, setBrandLocal] = useState('');
  const [price, setPriceLocal] = useState('');
  const [mileageFrom, setMileageFromLocal] = useState('');
  const [mileageTo, setMileageToLocal] = useState('');

  const reduxBrand = useSelector(selectBrand);
  const reduxPrice = useSelector(selectPrice);
  const reduxMileageFrom = useSelector(selectMileageFrom);
  const reduxMileageTo = useSelector(selectMileageTo);

  const isFiltered = useSelector(selectIsFiltered);

  const [brandsList, setBrandsList] = useState([]);
  const [pricesList, setPricesList] = useState([]);

  // Завантажуємо списки для селектів один раз
  useEffect(() => {
    axios
      .get('/brands')
      .then(res => setBrandsList(res.data))
      .catch(console.error);
    axios
      .get('/cars', { params: { limit: 100, page: 1 } })
      .then(res => {
        const prices = res.data.cars.map(car => Number(car.rentalPrice));
        const unique = Array.from(new Set(prices)).sort((a, b) => a - b);
        setPricesList(unique);
      })
      .catch(console.error);
  }, []);

  // Синхронізуємо локальні стейти з Redux (щоб оновлювати поля при завантаженні/оновленні)
  useEffect(() => {
    setBrandLocal(reduxBrand);
    setPriceLocal(reduxPrice);
    setMileageFromLocal(reduxMileageFrom);
    setMileageToLocal(reduxMileageTo);
  }, [reduxBrand, reduxPrice, reduxMileageFrom, reduxMileageTo]);

  // Автоматичне застосування фільтрів при завантаженні / оновленні сторінки
  useEffect(() => {
    if (autoAppliedRef.current) return;

    const urlBrand = searchParams.get('brand') || '';
    const urlPrice = searchParams.get('price') || '';
    const urlMileageFrom = searchParams.get('minMileage') || '';
    const urlMileageTo = searchParams.get('maxMileage') || '';

    if (!urlBrand && !urlPrice && !urlMileageFrom && !urlMileageTo) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch(setBrand(parsed.brand || ''));
          dispatch(setPrice(parsed.price || ''));
          dispatch(setMileageFrom(parsed.mileageFrom || ''));
          dispatch(setMileageTo(parsed.mileageTo || ''));

          dispatch(resetCars());
          dispatch(
            fetchCars({
              page: 1,
              limit: 12,
              brand: parsed.brand || '',
              rentalPrice: parsed.price || '',
              minMileage: parsed.mileageFrom || '',
              maxMileage: parsed.mileageTo || '',
            })
          );

          // Оновлюємо URL з локалстореджем
          const newParams = {};
          if (parsed.brand) newParams.brand = parsed.brand;
          if (parsed.price) newParams.price = parsed.price;
          if (parsed.mileageFrom) newParams.minMileage = parsed.mileageFrom;
          if (parsed.mileageTo) newParams.maxMileage = parsed.mileageTo;
          setSearchParams(newParams);

          autoAppliedRef.current = true;
          return;
        } catch {
          // ignore
        }
      }
    }

    // Якщо в URL є параметри — застосовуємо їх
    dispatch(setBrand(urlBrand));
    dispatch(setPrice(urlPrice));
    dispatch(setMileageFrom(urlMileageFrom));
    dispatch(setMileageTo(urlMileageTo));

    dispatch(resetCars());
    dispatch(
      fetchCars({
        page: 1,
        limit: 12,
        brand: urlBrand,
        rentalPrice: urlPrice,
        minMileage: urlMileageFrom,
        maxMileage: urlMileageTo,
      })
    );

    autoAppliedRef.current = true;
  }, [dispatch, searchParams, setSearchParams]);

  // При кліку на кнопку Search - оновлюємо URL, Redux і localStorage
  const handleSearch = () => {
    const newParams = {};
    if (brand) newParams.brand = brand;
    if (price) newParams.price = price;
    if (mileageFrom) newParams.minMileage = mileageFrom;
    if (mileageTo) newParams.maxMileage = mileageTo;

    setSearchParams(newParams);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ brand, price, mileageFrom, mileageTo })
    );

    dispatch(setBrand(brand));
    dispatch(setPrice(price));
    dispatch(setMileageFrom(mileageFrom));
    dispatch(setMileageTo(mileageTo));
    dispatch(setLastSearch(new URLSearchParams(newParams).toString()));

    dispatch(resetCars());
    dispatch(
      fetchCars({
        page: 1,
        limit: 12,
        brand,
        rentalPrice: price,
        minMileage: mileageFrom,
        maxMileage: mileageTo,
      })
    );
  };

  // При кліку Reset очищуємо все
  const handleReset = () => {
    setBrandLocal('');
    setPriceLocal('');
    setMileageFromLocal('');
    setMileageToLocal('');
    setSearchParams({});
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    dispatch(setBrand(''));
    dispatch(setPrice(''));
    dispatch(setMileageFrom(''));
    dispatch(setMileageTo(''));
    dispatch(setLastSearch(''));
    dispatch(resetCars());
    dispatch(fetchCars({ page: 1, limit: 12 }));
  };

  return (
    <section className={styles.filters}>
      <div className={styles.filterItem}>
        <span className={styles.label}>Car brand</span>
        <CustomSelect
          id="brand"
          value={brand}
          onChange={setBrandLocal}
          options={brandsList}
          placeholder="Choose a brand"
        />
      </div>
      <div className={styles.filterItem}>
        <span className={styles.label}>Price / 1 hour</span>
        <CustomSelect
          id="price"
          value={price}
          onChange={setPriceLocal}
          options={pricesList}
          placeholder="Choose a price"
        />
      </div>
      <div className={styles.filterItem}>
        <span className={styles.label}>Car mileage / km</span>
        <div className={styles.mileageInputs}>
          <input
            id="mileageFrom"
            name="mileageFrom"
            type="number"
            min="0"
            placeholder="From"
            value={mileageFrom}
            onChange={e => {
              const value = e.target.value;
              if (Number(value) >= 0 || value === '') {
                setMileageFromLocal(value);
              }
            }}
          />
          <input
            id="mileageTo"
            name="mileageTo"
            type="number"
            min="0"
            placeholder="To"
            value={mileageTo}
            onChange={e => {
              const value = e.target.value;
              if (Number(value) >= 0 || value === '') {
                setMileageToLocal(value);
              }
            }}
          />
        </div>
      </div>
      <button className={styles.searchBtn} onClick={handleSearch} type="button">
        Search
      </button>
      {isFiltered && (
        <button className={styles.resetBtn} onClick={handleReset} type="button">
          Clear filters
        </button>
      )}
    </section>
  );
};

export default Filters;
