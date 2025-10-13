import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/http';

const Sidebar = ({ categories: propCategories }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    // If categories are provided as props, use them
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      setLoading(false);
    } else {
      // Otherwise fetch them
      fetchCategories();
    }
  }, [propCategories]);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ position: 'sticky', top: 80 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {/* All Categories option */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/articles"
              selected={!selectedCategory}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                },
                '&.Mui-selected': {
                  fontWeight: 600,
                  '&:hover': {
                  },
                },
              }}
            >
              <ListItemText 
                primary="All Categories"
                primaryTypographyProps={{
                  fontWeight: !selectedCategory ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Individual categories */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category._id;
            return (
              <ListItem key={category._id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/articles?category=${category._id}`}
                  selected={isSelected}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-selected': {
                      fontWeight: 600,
                      '&:hover': {
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={category.name}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                  <Chip
                    size="small"
                    label={category.articleCount || 0}
                    sx={{
                      backgroundColor: category.color || 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default Sidebar;

