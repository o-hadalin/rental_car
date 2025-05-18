import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ value, onChange, options, placeholder, id }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let displayValue = placeholder;

  if (value) {
    if (typeof value === 'string' && value.startsWith('To $')) {
      displayValue = value;
    } else if (!isNaN(value)) {
      displayValue = `To $${value}`;
    } else {
      displayValue = value;
    }
  }
  return (
    <div className={styles.selectWrapper} ref={ref}>
      <div
        className={styles.display}
        onClick={() => setOpen(prev => !prev)}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(prev => !prev);
          }
        }}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        role="combobox"
        aria-controls={`${id}-listbox`}
        aria-label={placeholder}
      >
        {displayValue}
        <svg className={styles.arrowIcon} aria-hidden="true">
          <use href="/sprite.svg#arrow-down" />
        </svg>
      </div>

      {open && (
        <ul
          className={styles.optionsList}
          role="listbox"
          id={`${id}-listbox`}
          tabIndex={-1}
        >
          {options.map(opt => (
            <li
              key={opt}
              className={`${styles.option} ${
                opt === value ? styles.selected : ''
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              tabIndex={0}
              role="option"
              aria-selected={opt === value}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                }
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
