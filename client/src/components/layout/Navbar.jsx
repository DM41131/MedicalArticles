import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { api } from '../../api/http';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [navigation, setNavigation] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch navigation items
    api.navigation.get()
      .then(response => {
        setNavigation(response.data.items || []);
      })
      .catch(error => {
        console.error('Error fetching navigation:', error);
      });

    // Fetch categories
    api.categories.getAll()
      .then(response => {
        setCategories(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryMenu = (event) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
  };

  const handleCategoryClick = (categoryId) => {
    handleCategoryClose();
    navigate(`/articles?category=${categoryId}`);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoriesToggle = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const drawer = (
    <Box>
      <Typography variant="h6" sx={{ my: 2, px: 2, fontWeight: 600 }}>
        მედარეა
      </Typography>
      <Divider />
      <List>
        {navigation
          .filter(item => item.label !== 'Categories')
          .map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        
        {/* Categories Dropdown in Mobile */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleCategoriesToggle}>
            <ListItemText primary="Categories" />
            {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categories.map((category) => (
              <ListItemButton
                key={category._id}
                sx={{ pl: 4 }}
                onClick={() => {
                  handleCategoryClick(category._id);
                  handleDrawerToggle();
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  {category.icon}
                </Box>
                <ListItemText primary={category.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 0,
              mr: 4,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            მედარეა
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {navigation
                .filter(item => item.label !== 'Categories')
                .map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                  >
                    {item.label}
                  </Button>
                ))}
              
              {/* Categories Dropdown */}
              <Button
                color="inherit"
                onClick={handleCategoryMenu}
                endIcon={<ArrowDropDownIcon />}
              >
                კატეგორიები
              </Button>
              <Menu
                anchorEl={categoryAnchorEl}
                open={Boolean(categoryAnchorEl)}
                onClose={handleCategoryClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    sx={{ minWidth: 200 }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                        mr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      {category.icon}
                    </Box>
                    {category.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Search Box */}
          {!isMobile && (
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="საძიებო სისტემა..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: alpha('#fff', 0.15),
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 5,
                    '& fieldset': {
                      borderColor: 'transparent',
                      borderRadius: 5,
                    },
                    '&:hover fieldset': {
                      borderColor: alpha('#fff', 0.25),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: alpha('#fff', 0.5),
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: alpha('#fff', 0.7),
                    opacity: 1,
                  },
                }}
              />
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {user ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} alt={user.username} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user.username}</Typography>
                </MenuItem>
                {isAdmin() && (
                  <MenuItem
                    component={Link}
                    to="/admin"
                    onClick={handleClose}
                  >
                    <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
                    ადმინის პანელი
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  გამოსვლა
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              შესვლა
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;

