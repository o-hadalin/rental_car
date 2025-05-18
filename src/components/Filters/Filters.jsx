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
  selectIsFiltered,
} from '../../redux/filters/selectors';
import { resetCars } from '../../redux/cars/slice';
import { fetchCars } from '../../redux/cars/operations';
import styles from './Filters.module.css';
import CustomSelect from '../CustomSelect/CustomSelect';

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
  const [initDone, setInitDone] = useState(false);
  const [autoFilterNeeded, setAutoFilterNeeded] = useState(false);
  const isFiltered = useSelector(selectIsFiltered);

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
  }, [
    initDone,
    dispatch,
    brand,
    price,
    mileageFrom,
    mileageTo,
    autoFilterNeeded,
  ]);

  const handleSearch = () => {
    const newParams = {};
    if (brand) newParams.brand = brand;
    if (price) newParams.price = price;
    if (mileageFrom) newParams.minMileage = mileageFrom;
    if (mileageTo) newParams.maxMileage = mileageTo;

    setSearchParams(newParams);
    setAutoFilterNeeded(false);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ brand, price, mileageFrom, mileageTo })
    );
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

  const handleReset = () => {
    dispatch(setBrand(''));
    dispatch(setPrice(''));
    dispatch(setMileageFrom(''));
    dispatch(setMileageTo(''));
    setSearchParams({});
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
          onChange={value => dispatch(setBrand(value))}
          options={brandsList}
          placeholder="Choose a brand"
        />
      </div>
      <div className={styles.filterItem}>
        <span className={styles.label}>Price / 1 hour</span>
        <CustomSelect
          id="price"
          value={price}
          onChange={value => dispatch(setPrice(value))}
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
                dispatch(setMileageFrom(value));
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
                dispatch(setMileageTo(value));
              }
            }}
          />
        </div>
      </div>
      <button className={styles.searchBtn} onClick={handleSearch}>
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
