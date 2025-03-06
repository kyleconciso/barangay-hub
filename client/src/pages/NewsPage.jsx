import React, { useState, useEffect } from 'react';
import { getAllPages } from '../services/pages.service';
import ArticleList from '../components/News/ArticleList';
import { Container, Typography } from '@mui/material';
import Loader from '../components/UI/Loader';
import ErrorMessage from '../components/UI/ErrorMessage';
import { Route, Routes } from 'react-router-dom';
import ArticleItem from '../components/News/ArticleItem';

function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const allPages = await getAllPages();
                const filteredArticles = allPages.filter(page => page.type === 'ARTICLE');
                setArticles(filteredArticles);
            } catch (err) {
                setError('Failed to load articles.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return (
        <Container>
            <Routes>
                <Route path="/" element={
                    <>
                    <Typography variant="h4" gutterBottom>News Articles</Typography>
                    <ArticleList articles={articles} />
                    </>
                } />
                <Route path="/:slug" element={<ArticleItem />} />
            </Routes>
        </Container>
    );
}

export default NewsPage;