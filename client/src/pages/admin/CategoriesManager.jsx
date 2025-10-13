import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  alpha,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  InputAdornment,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ColorLens as ColorLensIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { api } from '../../api/http';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [articleCounts, setArticleCounts] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    icon: '',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      setCategories(response.data);
      setFilteredCategories(response.data);
      
      // Fetch article counts for each category
      const counts = {};
      await Promise.all(
        response.data.map(async (category) => {
          try {
            const articlesResponse = await api.articles.getAll({ category: category._id });
            counts[category._id] = articlesResponse.data.length;
          } catch (error) {
            counts[category._id] = 0;
          }
        })
      );
      setArticleCounts(counts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category._id);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || '#1976d2',
        icon: category.icon || '',
        order: category.order || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
        icon: '',
        order: categories.length,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await api.categories.update(editingCategory, formData);
      } else {
        await api.categories.create(formData);
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async () => {
    try {
      await api.categories.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.error || 'Failed to delete category');
    }
  };

  const colorPresets = [
    '#1976d2', '#2e7d32', '#d32f2f', '#ed6c02', 
    '#9c27b0', '#0288d1', '#7b1fa2', '#c2185b',
    '#5d4037', '#455a64', '#00796b', '#f57c00'
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Categories Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your articles with categories
          </Typography>
        </Box>

        {/* Categories Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  All Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                }}
              >
                New Category
              </Button>
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
                <ColorLensIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No categories yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create your first category to organize articles
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Create Category
                </Button>
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
                        <TableCell align="center"><strong>Order</strong></TableCell>
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
                              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                {category.description || 'No description'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <ArticleIcon fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="medium">
                                  {articleCounts[category._id] || 0}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={category.order}
                                sx={{
                                  bgcolor: alpha(category.color, 0.1),
                                  color: category.color,
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="caption" color="text.secondary">
                                {new Date(category.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(category)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => setDeleteDialog({ open: true, id: category._id })}
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

        {/* Category Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Technology, Science, Health"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Brief description of this category..."
              />
              
              <TextField
                fullWidth
                label="Icon (emoji or text)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="💻 🔬 🏥 💼 🎨"
                helperText="Use an emoji or icon that represents this category"
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {colorPresets.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: color,
                        cursor: 'pointer',
                        border: formData.color === color ? '3px solid' : '2px solid',
                        borderColor: formData.color === color ? 'primary.main' : 'divider',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s',
                        },
                      }}
                    />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Custom Color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                helperText="Lower numbers appear first"
              />

              {/* Preview */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  border: `2px solid ${alpha(formData.color, 0.3)}`,
                  bgcolor: alpha(formData.color, 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Preview:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: formData.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                    }}
                  >
                    {formData.icon || '📁'}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {formData.name || 'Category Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.description || 'Description will appear here'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.name}
              sx={{
                background: `linear-gradient(135deg, ${formData.color} 0%, ${alpha(formData.color, 0.8)} 100%)`,
              }}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone if there are no articles in this category."
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialog({ open: false, id: null })}
        />
      </Container>
    </Box>
  );
};

export default CategoriesManager;
