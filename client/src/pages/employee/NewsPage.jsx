
import React, { useState, useEffect } from 'react';
import { getAllNews } from '../../api/news';
import NewsCard from '../../components/News/NewsCard';
import Pagination from '../../components/common/Pagination'; 
import { ITEMS_PER_PAGE } from '../../utils/constants';
import Loader from '../../components/common/Loader';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); //  curr page
  const [totalItems, setTotalItems] = useState(0); //  # items

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const {news: newsData, totalCount} = await getAllNews(currentPage, ITEMS_PER_PAGE); // destructure
        setNews(newsData);
        setTotalItems(totalCount); //   count from API
      } catch (err) {
        setError(err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]); //  rerun if currentPage change

    const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>News</h1>
       {/*   News button */}
      {news.length > 0 ? (
          <>
            {news.map((item) => (
              <NewsCard key={item.id} newsItem={item} />
            ))}
             <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
          </>

      ) : (
        <p>no news articles found.</p>
      )}
    </div>
  );
}

export default NewsPage;