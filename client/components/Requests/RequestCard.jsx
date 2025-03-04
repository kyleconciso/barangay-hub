
import React from 'react';
import styles from './RequestCard.css';
import Card from '../ui/Card';

function RequestCard({ request }) {
  return (
    <Card className={styles.requestCard}>
      <img src={request.logoURL} alt={request.name} className={styles.logo} />
      <h2 className={styles.name}>{request.name}</h2>
      <p className={styles.description}>{request.description}</p>
      <a href={request.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Go to Request
      </a>
    </Card>
  );
}

export default RequestCard;