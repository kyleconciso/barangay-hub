import React from 'react';
import { SITE_NAME, DEFAULT_LOCATION, DEFAULT_TELEPHONE } from '../../utils/constants';
import styles from './HomePage.css';

function HomePage() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Welcome to {SITE_NAME}!</h1>
      <p className={styles.info}>Location: {DEFAULT_LOCATION}</p>
      <p className={styles.info}>Telephone: {DEFAULT_TELEPHONE}</p>

      <p className={styles.welcomeMessage}>
        This is the official website of our barangay.  Here you can find information
        about our community, news, events, and services.
        Daytoy ti opisyal a website ti barangaymi.
        Ditoy, mabalinyo a maammu dagiti naipateg nga impormasyon maipapan ti komunidadmi, dagiti baro a damag, aktibidad, ken serbisyong maited ti barangay.
      </p>
      {/* todo news */}
    </div>
  );
}

export default HomePage;