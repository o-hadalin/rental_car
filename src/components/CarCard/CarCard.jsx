import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../redux/favorites/slice';
import { selectFavorites } from '../../redux/favorites/selectors';
import Icon from '../../components/Icon/Icon.jsx';
import styles from './CarCard.module.css';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const {
    id,
    img,
    make,
    model,
    year,
    rentalPrice,
    address,
    rentalCompany,
    type,
    mileage,
    functionalities,
  } = car;
  const city = address?.split(', ')[1] || '';
  const country = address?.split(', ')[2] || '';

  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.includes(id);

  const handleToggle = () => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={img} alt={`${make} ${model}`} />
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
          {make} <span>{model}</span>, {year}
        </h3>
        <p className={styles.price}>{rentalPrice}</p>
      </div>
      <ul className={styles.features}>
        <li>{city}</li>
        <li>{country}</li>
        <li>{rentalCompany}</li>
        <li>{type}</li>
        <li>{mileage.toLocaleString('en-US')} km</li>
        <li>{functionalities?.[0]}</li>
      </ul>
      <Link to={`/catalog/${id}`} className={styles.detailsBtn}>
        Learn more
      </Link>
    </div>
  );
};

export default CarCard;
