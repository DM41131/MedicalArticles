import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  alpha,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowUpward,
  ArrowDownward,
  DragIndicator as DragIndicatorIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { api } from '../../api/http';

const NavigationManager = () => {
  const [navigation, setNavigation] = useState({ items: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await api.navigation.get('main');
      setNavigation(response.data);
    } catch (error) {
      console.error('Error fetching navigation:', error);
    }
  };

  const handleAddItem = () => {
    setNavigation({
      ...navigation,
      items: [
        ...navigation.items,
        {
          label: 'New Item',
          path: '/',
          icon: '',
          order: navigation.items.length,
          children: [],
        },
      ],
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...navigation.items];
    newItems[index][field] = value;
    setNavigation({ ...navigation, items: newItems });
  };

  const handleDeleteItem = (index) => {
    const newItems = navigation.items.filter((_, i) => i !== index);
    setNavigation({ ...navigation, items: newItems });
  };

  const handleMoveItem = (index, direction) => {
    const newItems = [...navigation.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update order values
    newItems.forEach((item, i) => {
      item.order = i;
    });
    
    setNavigation({ ...navigation, items: newItems });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.navigation.update('main', { items: navigation.items });
      alert('Navigation updated successfully!');
    } catch (error) {
      console.error('Error saving navigation:', error);
      alert('Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Navigation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your site's main navigation menu
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>

        {/* Info Card */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: `linear-gradient(135deg, ${alpha('#2196f3', 0.1)} 0%, ${alpha('#2196f3', 0.05)} 100%)`,
            border: `1px solid ${alpha('#2196f3', 0.2)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Note:</strong> Categories are now displayed as a dropdown menu in the navbar.
            Items will appear in the order shown below.
          </Typography>
        </Paper>

        {/* Navigation Items */}
        {navigation.items.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <LinkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No navigation items
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add your first navigation item to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navigation.items.map((item, index) => (
              <Card
                key={index}
                sx={{
                  border: '2px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 3,
                  },
                  transition: 'all 0.2s',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Drag Indicator */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
                      <DragIndicatorIcon color="action" />
                      <Chip
                        size="small"
                        label={index + 1}
                        sx={{ width: 28, height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>

                    {/* Form Fields */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="Label"
                          size="small"
                          value={item.label}
                          onChange={(e) => handleUpdateItem(index, 'label', e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Path"
                          size="small"
                          value={item.path}
                          onChange={(e) => handleUpdateItem(index, 'path', e.target.value)}
                          sx={{ flex: 1 }}
                          placeholder="/path"
                        />
                      </Box>
                      <TextField
                        label="Icon (optional)"
                        size="small"
                        value={item.icon}
                        onChange={(e) => handleUpdateItem(index, 'icon', e.target.value)}
                        placeholder="HomeIcon, ArticleIcon, etc."
                        fullWidth
                      />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        color="primary"
                      >
                        <ArrowUpward />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === navigation.items.length - 1}
                        color="primary"
                      >
                        <ArrowDownward />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Save Button at Bottom */}
        {navigation.items.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                px: 4,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NavigationManager;
