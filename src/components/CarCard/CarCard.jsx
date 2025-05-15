import styles from './CarCard.module.css';

const CarCard = ({ car }) => {
  const {
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

  return (
    <div className={styles.card}>
      <img className={styles.image} src={img} alt={`${make} ${model}`} />
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
      <button className={styles.detailsBtn}>Learn more</button>
    </div>
  );
};

export default CarCard;
