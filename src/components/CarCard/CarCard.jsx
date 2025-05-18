import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../redux/favorites/slice';
import { selectFavorites } from '../../redux/favorites/selectors';
import LazyImage from '../LazyImage/LazyImage';
import Icon from '../../components/Icon/Icon.jsx';
import styles from './CarCard.module.css';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const {
    id,
    img,
    brand,
    model,
    year,
    rentalPrice,
    address,
    rentalCompany,
    type,
    mileage,
  } = car;
  const city = address?.split(', ')[1] || '';
  const country = address?.split(', ')[2] || '';

  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.includes(id);

  const handleToggle = () => {
    dispatch(toggleFavorite(id));
  };
  const formattedType = type?.[0].toUpperCase() + type?.slice(1).toLowerCase();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <LazyImage
          src={img}
          alt={`${brand} ${model}`}
          className={styles.image}
        />
        <button
          className={styles.favoriteBtn}
          onClick={handleToggle}
          aria-label="Toggle favorite"
        >
          <Icon name={isFavorite ? 'heart-active' : 'heart-no-active'} />
        </button>
      </div>
      <div className={styles.topRow}>
        <h3 className={styles.title}>
          {brand} <span>{model}</span>, {year}
        </h3>
        <p className={styles.price}>${rentalPrice}</p>
      </div>
      <ul className={styles.features}>
        <li>{city}</li>
        <li>{country}</li>
        <li>{rentalCompany}</li>
        <li>{formattedType}</li>
        <li>{mileage.toLocaleString('uk-UA')} km</li>
      </ul>
      <Link to={`/catalog/${id}`} className={styles.detailsBtn}>
        Read more
      </Link>
    </div>
  );
};

export default CarCard;
