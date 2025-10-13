import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/articles/ArticleCard';
import { api } from '../api/http';

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Sync filters state with URL params whenever they change
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || '-createdAt',
    });
  }, [searchParams]);

  useEffect(() => {
    fetchArticles();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const search = searchParams.get('search');
      const page = searchParams.get('page') || 1;
      const category = searchParams.get('category');
      const sort = searchParams.get('sort') || '-createdAt';

      let response;
      
      // If there's a search query, use the search endpoint
      if (search && search.trim().length > 0) {
        response = await api.articles.search({
          q: search,
          page,
          limit: 12,
          category: category || undefined,
          sort,
        });
        
        // Update categories with search results counts
        if (response.categories) {
          setCategories(response.categories);
        }
      } else {
        // Otherwise use the regular getAll endpoint
        const params = {
          page,
          category: category || undefined,
          sort,
        };
        response = await api.articles.getAll(params);
      }

      setArticles(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) {
        newParams.set(k, newFilters[k]);
      }
    });
    setSearchParams(newParams);
  };

  const handlePageChange = (event, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', value);
    setSearchParams(newParams);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Articles
      </Typography>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12}>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort}
                label="Sort By"
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <MenuItem value="-createdAt">Newest</MenuItem>
                <MenuItem value="createdAt">Oldest</MenuItem>
                <MenuItem value="-views">Most Viewed</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Articles Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : articles.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No articles found
            </Typography>
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
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Articles;

