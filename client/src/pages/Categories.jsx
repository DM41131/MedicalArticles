import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  alpha,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/http';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.categories.getAll();
        
        // Fetch article count for each category
        const categoriesWithCounts = await Promise.all(
          response.data.map(async (category) => {
            try {
              const articlesResponse = await api.articles.getAll({ category: category._id });
              return {
                ...category,
                articleCount: articlesResponse.data.length,
              };
            } catch (error) {
              return {
                ...category,
                articleCount: 0,
              };
            }
          })
        );
        
        setCategories(categoriesWithCounts);
        setFilteredCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let result = categories;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCategories(result);
    setPage(0);
  }, [searchQuery, categories]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewArticles = (categoryId) => {
    navigate(`/articles?category=${categoryId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organize your articles with categories
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>

          {categories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No categories yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categories will appear here once they are created
              </Typography>
            </Box>
          ) : filteredCategories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No categories match your search
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="center"><strong>Articles</strong></TableCell>
                      <TableCell align="center"><strong>Created</strong></TableCell>
                      <TableCell align="right"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCategories
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((category) => (
                        <TableRow
                          key={category._id}
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha('#667eea', 0.05),
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: category.color || '#1976d2',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem',
                                }}
                              >
                                {category.icon || '📁'}
                              </Box>
                              <Typography variant="body2" fontWeight="medium">
                                {category.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                              {category.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <ArticleIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight="medium">
                                {category.articleCount || 0}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary">
                              {new Date(category.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() => handleViewArticles(category._id)}
                              sx={{
                                textTransform: 'none',
                                borderColor: alpha(category.color || '#1976d2', 0.3),
                                color: category.color || '#1976d2',
                                '&:hover': {
                                  borderColor: category.color || '#1976d2',
                                  backgroundColor: alpha(category.color || '#1976d2', 0.1),
                                },
                              }}
                            >
                              View Articles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredCategories.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Categories;

