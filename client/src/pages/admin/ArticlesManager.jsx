import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/http';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ArticlesManager = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  
  // Table and filter states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, searchQuery, statusFilter, categoryFilter]);

  const fetchData = async () => {
    try {
      // Fetch all articles for the table
      const articlesResponse = await api.articles.getAll({
        published: 'all',
        limit: 1000,
        sort: '-createdAt',
      });
      setArticles(articlesResponse.data);

      // Fetch categories for filter
      const categoriesResponse = await api.categories.getAll();
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'published') {
        filtered = filtered.filter(article => article.published);
      } else if (statusFilter === 'draft') {
        filtered = filtered.filter(article => !article.published);
      } else if (statusFilter === 'featured') {
        filtered = filtered.filter(article => article.featured);
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category._id === categoryFilter);
    }

    setFilteredArticles(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      await api.articles.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Articles Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your articles in one place
          </Typography>
        </Box>

        {/* Articles Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  All Articles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/admin/articles/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                }}
              >
                New Article
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Search and Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="featured">Featured</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {articles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ArticleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No articles yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Start creating your first article
                </Typography>
                <Button
                  component={Link}
                  to="/admin/articles/new"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Create Article
                </Button>
              </Box>
            ) : filteredArticles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <FilterListIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No articles match your filters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                        <TableCell align="center"><strong>Views</strong></TableCell>
                        <TableCell align="center"><strong>Date</strong></TableCell>
                        <TableCell align="right"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredArticles
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((article) => (
                          <TableRow
                            key={article._id}
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha('#667eea', 0.05),
                              },
                            }}
                          >
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {article.title}
                                </Typography>
                                {article.featured && (
                                  <Chip
                                    icon={<StarBorderIcon />}
                                    label="Featured"
                                    size="small"
                                    color="warning"
                                    sx={{ mt: 0.5, height: 20 }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={article.category.name}
                                sx={{
                                  bgcolor: alpha(article.category.color, 0.1),
                                  color: article.category.color,
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={article.published ? 'Published' : 'Draft'}
                                color={article.published ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <VisibilityIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {article.views || 0}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="caption" color="text.secondary">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => navigate(`/admin/articles/${article._id}/edit`)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => setDeleteDialog({ open: true, id: article._id })}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredArticles.length}
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

        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialog({ open: false, id: null })}
        />
      </Container>
    </Box>
  );
};

export default ArticlesManager;

