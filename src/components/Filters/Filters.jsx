import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
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
import { resetCars } from '../../redux/cars/slice';
import { fetchCars } from '../../redux/cars/operations';
import styles from './Filters.module.css';

const LOCAL_STORAGE_KEY = 'rentalCarFilters';

const Filters = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const brand = useSelector(selectBrand);
  const price = useSelector(selectPrice);
  const mileageFrom = useSelector(selectMileageFrom);
  const mileageTo = useSelector(selectMileageTo);

  const [brandsList, setBrandsList] = useState([]);
  const [pricesList, setPricesList] = useState([]);
  const [initDone, setInitDone] = useState(false); // щоб не запускати fetchCars раніше часу
  const [autoFilterNeeded, setAutoFilterNeeded] = useState(false);

  // Завантаження брендів
  useEffect(() => {
    axios
      .get('/brands')
      .then(res => setBrandsList(res.data))
      .catch(console.error);
  }, []);

  // Завантаження унікальних цін
  useEffect(() => {
    axios
      .get('/cars', { params: { limit: 100, page: 1 } })
      .then(res => {
        const prices = res.data.cars.map(car => car.rentalPrice);
        const unique = Array.from(new Set(prices)).sort(
          (a, b) => Number(a) - Number(b)
        );
        setPricesList(unique);
      })
      .catch(console.error);
  }, []);

  // Відновлення фільтрів з URL або localStorage при старті
  useEffect(() => {
    const paramsBrand = searchParams.get('brand') || '';
    const paramsPrice = searchParams.get('price') || '';
    const paramsMileageFrom = searchParams.get('minMileage') || '';
    const paramsMileageTo = searchParams.get('maxMileage') || '';

    if (paramsBrand || paramsPrice || paramsMileageFrom || paramsMileageTo) {
      setAutoFilterNeeded(true);
      dispatch(setBrand(paramsBrand));
      dispatch(setPrice(paramsPrice));
      dispatch(setMileageFrom(paramsMileageFrom));
      dispatch(setMileageTo(paramsMileageTo));
    } else {
      // Якщо в URL немає — пробуємо localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch(setBrand(parsed.brand || ''));
          dispatch(setPrice(parsed.price || ''));
          dispatch(setMileageFrom(parsed.mileageFrom || ''));
          dispatch(setMileageTo(parsed.mileageTo || ''));
        } catch {
          // ignore
        }
      }
    }
    setInitDone(true);
  }, [dispatch, searchParams]);

  // Після відновлення фільтрів запускаємо пошук автоматично разово
  useEffect(() => {
    if (!initDone || !autoFilterNeeded) return;
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
    setAutoFilterNeeded(false);
  }, [initDone, dispatch, brand, price, mileageFrom, mileageTo]);

  const handleSearch = () => {
    // Оновлюємо URL
    const newParams = {};
    if (brand) newParams.brand = brand;
    if (price) newParams.price = price;
    if (mileageFrom) newParams.minMileage = mileageFrom;
    if (mileageTo) newParams.maxMileage = mileageTo;
    setSearchParams(newParams);

    // Зберігаємо в localStorage
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        brand,
        price,
        mileageFrom,
        mileageTo,
      })
    );

    dispatch(resetCars());
    // 🔶 Note: rentalPrice performs filtering on the backend, but the API returns all cars with price ≤ rentalPrice
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

  return (
    <section className={styles.filters}>
      <div className={styles.filterItem}>
        <label htmlFor="brand">Car brand</label>
        <select
          id="brand"
          value={brand}
          onChange={e => dispatch(setBrand(e.target.value))}
        >
          <option value="">Choose a brand</option>
          {brandsList.map(b => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterItem}>
        <label htmlFor="price">Price / 1 hour (up to)</label>
        <select
          id="price"
          value={price}
          onChange={e => dispatch(setPrice(e.target.value))}
        >
          <option value="">Choose a price</option>
          {pricesList.map(p => (
            <option key={p} value={p}>
              ${p}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterItem}>
        <label htmlFor="mileageFrom">Car mileage / km</label>
        <div className={styles.mileageInputs}>
          <input
            id="mileageFrom"
            name="mileageFrom"
            type="number"
            placeholder="From"
            value={mileageFrom}
            onChange={e => dispatch(setMileageFrom(e.target.value))}
          />
          <input
            id="mileageTo"
            name="mileageTo"
            type="number"
            placeholder="To"
            value={mileageTo}
            onChange={e => dispatch(setMileageTo(e.target.value))}
          />
        </div>
      </div>
      <button className={styles.searchBtn} onClick={handleSearch}>
        Search
      </button>
    </section>
  );
};

export default Filters;
