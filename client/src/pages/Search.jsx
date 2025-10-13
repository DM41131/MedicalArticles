import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/articles/ArticleCard';
import { api } from '../api/http';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (query.trim().length > 0) {
      searchArticles();
    } else {
      setArticles([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, currentPage]);

  const searchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.articles.search({
        q: query,
        page: currentPage,
        limit: 12,
      });
      
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setSearchParams({ q: query, page: value });
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Search Results
        </Typography>
      </Box>

      {/* Results */}
      {query && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            {loading ? (
              'Searching...'
            ) : pagination.total > 0 ? (
              `Found ${pagination.total} result${pagination.total !== 1 ? 's' : ''} for "${query}"`
            ) : (
              `No results found for "${query}"`
            )}
          </Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : articles.length === 0 && query ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No articles found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try different keywords or check your spelling
          </Typography>
        </Paper>
      ) : articles.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Start searching
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter keywords to search across all articles
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article._id}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Search;

