import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NewsCard.css';
import { formatDate } from '../../utils/date';
import Card from '../ui/Card';

function NewsCard({ newsItem }) {
  return (
    <Card className={styles.newsCard}>
      <h2 className={styles.title}>
        <Link to={`/news/${newsItem.slug}`} className={styles.link}>{newsItem.title}</Link>
      </h2>
      <p className={styles.date}>{formatDate(newsItem.date.toDate())}</p> {/* date*/}
      <p className={styles.excerpt}>{newsItem.content.substring(0, 150)}...</p> {/*  excerpt */}
      <Link to={`/news/${newsItem.slug}`} className={styles.readMore}>Read More</Link>
    </Card>
  );
}

export default NewsCard;