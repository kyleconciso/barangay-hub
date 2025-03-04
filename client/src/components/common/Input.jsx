import React from 'react';
import styles from './Input.css';

function Input({ label, name, value, onChange, type = 'text', placeholder, error, className = '', ...props }) {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.errorInput : ''}`} // error class
        {...props} // spread other props (maxLength, min)
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export default Input;