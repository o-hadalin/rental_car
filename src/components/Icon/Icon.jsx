import styles from './Icon.module.css';
import Heart from '../../assets/heart.svg?react';
//logo - ?
//favicon - ?

const iconsMap = {
  heart: Heart,
};

const Icon = ({ name, className = '' }) => {
  const SvgIcon = iconsMap[name];
  return SvgIcon ? <SvgIcon className={`${styles.icon} ${className}`} /> : null;
};

//for future sprite
// const Icon = ({ name, className = '' }) => (
//   <svg className={`${styles.icon} ${className}`}>
//     <use href={`/sprite.svg#${name}`} />
//   </svg>
// );

export default Icon;
