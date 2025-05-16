import styles from './Icon.module.css';

const Icon = ({ name, className = '' }) => (
  <svg
    className={`${styles.icon} ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <use xlinkHref={`/sprite.svg#${name}`} />
  </svg>
);

export default Icon;
