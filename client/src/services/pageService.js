import api from './api';
import { useState, useEffect } from 'react';

export const pageService = {
  createPage: async (pageData) => {
    try {
      const response = await api.post('/pages', pageData);
      return response.data;
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  },
  getPageBySlug: async (slug) => {
    try {
      const response = await api.get(`/pages/${slug}`);
      return response.data.data.page;
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      throw error;
    }
  },
  getAllPages: async () => {
    try {
      const response = await api.get('/pages');
      return response.data;
    } catch (error) {
      console.error("Error fetching all pages:", error);
      throw error;
    }
  },
  updatePage: async (slug, pageData) => {
    try {
      const response = await api.put(`/pages/${slug}`, pageData);
      return response.data;
    } catch (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  },
  deletePage: async (slug) => {
    try {
      const response = await api.delete(`/pages/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting page:", error);
      throw error;
    }
  },
};


export const useGetPageBySlug = (slug) => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPage = async () => {
        try {
          const fetchedPage = await pageService.getPageBySlug(slug);
          setPage(fetchedPage);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPage();
    }, [slug]);

    return { page, loading, error };
};