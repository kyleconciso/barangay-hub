
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsBySlug } from '../../api/news';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import { formatDate } from '../../utils/date';
import Loader from '../../components/common/Loader';
import styles from './NewsSinglePage.css';

function NewsSinglePage() {
  const { slug } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNewsBySlug(slug);
        setNewsItem(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch news article');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!newsItem) {
    return <p>News article not found.</p>;
  }

  return (
    <div className={styles.newsSinglePage}>
      <h1 className={styles.title}>{newsItem.title}</h1>
      <p className={styles.date}>{formatDate(newsItem.date.toDate())}</p>
       <MarkdownRenderer content={newsItem.content} />
    </div>
  );
}

export default NewsSinglePage;