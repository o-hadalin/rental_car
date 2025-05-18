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

const CustomSelect = ({ value, onChange, options, placeholder, id }) => {
  const getDisplayValue = () => {
    if (!value) return placeholder;
    return id === 'price' ? `To $${value}` : value;
  };

  return (
    <div className={styles.selectWrapper}>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={styles.select}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className={styles.customDisplay}>
        {getDisplayValue()}
        <svg className={styles.arrowIcon}>
          <use href="/sprite.svg#arrow-down" />
        </svg>
      </div>
    </div>
  );
};

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

  return (
    <section className={styles.filters}>
      <div className={styles.filterItem}>
        <label htmlFor="brand">Car brand</label>
        <CustomSelect
          id="brand"
          value={brand}
          onChange={value => dispatch(setBrand(value))}
          options={brandsList}
          placeholder="Choose a brand"
        />
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="price">Price / 1 hour</label>
        <CustomSelect
          id="price"
          value={price}
          onChange={value => dispatch(setPrice(value))}
          options={pricesList}
          placeholder="Choose a price"
        />
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="mileageFrom">Car mileage / km</label>
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
    </section>
  );
};

export default Filters;
