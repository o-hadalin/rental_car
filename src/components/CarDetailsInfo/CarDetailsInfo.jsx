import styles from './CarDetailsInfo.module.css';

const CarDetailsInfo = ({ car }) => {
  const {
    make,
    model,
    year,
    type,
    engineSize,
    fuelConsumption,
    mileage,
    rentalPrice,
    rentalConditions,
    accessories,
    functionalities,
    address,
    img,
    description,
  } = car;

  // Отримуємо ID з назви зображення
  const imageIdMatch = img.match(/\/(\d+)-/);
  const imageId = imageIdMatch ? imageIdMatch[1] : 'n/a';

  const conditions = Array.isArray(rentalConditions)
    ? rentalConditions
    : String(rentalConditions).split('\n');

  return (
    <div className={styles.container}>
      {/* Верхній блок */}
      <div className={styles.topBlock}>
        <p className={styles.carName}>
          {make} {model}, {year}
          <span className={styles.carImageId}>Id: {imageId}</span>
        </p>

        <div className={styles.metaRow}>
          <p className={styles.metaItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#location" />
            </svg>
            {address}
            <span className={styles.mileage}>
              Mileage: {mileage.toLocaleString()} km
            </span>
          </p>
        </div>

        <p className={styles.price}>
          <svg className={styles.icon}>
            <use href="/sprite.svg#dollar" />
          </svg>
          ${rentalPrice}
        </p>

        <p className={styles.description}>{description}</p>
      </div>

      {/* Нижній блок */}
      <div className={styles.bottomBlock}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Rental Conditions:</p>
          <ul className={styles.list}>
            {conditions.map((item, idx) => (
              <li key={idx} className={styles.listItem}>
                <svg className={styles.icon}>
                  <use href="/sprite.svg#check-circle" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Car Specifications:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#calendar" />
              </svg>
              Year: {year}
            </li>
            <li className={styles.listItem}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#car" />
              </svg>
              Type: {type}
            </li>
            <li className={styles.listItem}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#fuel-pump" />
              </svg>
              Fuel Consumption: {fuelConsumption}
            </li>
            <li className={styles.listItem}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#gear" />
              </svg>
              Engine Size: {engineSize}
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            Accessories and functionalities:
          </p>
          <ul className={styles.list}>
            {[...accessories, ...functionalities].map((item, idx) => (
              <li key={idx} className={styles.listItem}>
                <svg className={styles.icon}>
                  <use href="/sprite.svg#check-circle" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsInfo;
