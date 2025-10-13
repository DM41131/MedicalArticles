import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  alpha,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Label as LabelIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '../../components/markdown/MarkdownEditor';
import FilePicker from '../../components/common/FilePicker';
import { api } from '../../api/http';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    sources: [],
    tags: [],
    published: true,
    featured: false,
    coverImage: null,
  });

  const [tagInput, setTagInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticle = async () => {
    try {
      const response = await api.articles.getById(id);
      const article = response.data;
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category._id,
        sources: article.sources || [],
        tags: article.tags || [],
        published: article.published,
        featured: article.featured,
        coverImage: article.coverImage,
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = { ...formData };
      
      if (isEdit) {
        await api.articles.update(id, data);
        alert('Article updated successfully!');
      } else {
        await api.articles.create(data);
        alert('Article created successfully!');
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleAddSource = () => {
    if (sourceInput.trim() && !formData.sources.includes(sourceInput.trim())) {
      setFormData({
        ...formData,
        sources: [...formData.sources, sourceInput.trim()],
      });
      setSourceInput('');
    }
  };

  const handleDeleteSource = (sourceToDelete) => {
    setFormData({
      ...formData,
      sources: formData.sources.filter((source) => source !== sourceToDelete),
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {isEdit ? 'Edit Article' : 'Create New Article'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update your article content and settings' : 'Write and publish a new article'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Information Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📝 Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter an engaging title..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Brief summary of the article (200 characters max)"
                  helperText={`${formData.excerpt.length}/200 characters`}
                  inputProps={{ maxLength: 200 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: cat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                              }}
                            >
                              {cat.icon}
                            </Box>
                            {cat.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Cover Image Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ImageIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Cover Image
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <FilePicker
                label="Upload Cover Image"
                currentFile={formData.coverImage}
                onChange={(file) => setFormData({ ...formData, coverImage: file })}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Recommended size: 1200x600 pixels. Max file size: 5MB
              </Alert>
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LabelIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Tags
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add Tag
                </Button>
              </Box>
              
              {formData.tags.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet. Tags help organize and categorize your content.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Sources Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LinkIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Sources
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add a source URL or reference..."
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSource();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                  helperText="Can be a URL or text reference"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddSource}
                  disabled={!sourceInput.trim()}
                >
                  Add Source
                </Button>
              </Box>
              
              {formData.sources.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {formData.sources.map((source, index) => (
                    <Chip
                      key={index}
                      label={source}
                      onDelete={() => handleDeleteSource(source)}
                      color="secondary"
                      variant="outlined"
                      sx={{
                        height: 'auto',
                        minHeight: '32px',
                        '& .MuiChip-label': {
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No sources added yet. Sources provide references and credibility to your content.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Content Editor Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ✍️ Article Content
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Markdown & HTML Tips:</strong>
                <br />
                • <strong>Headers:</strong> # H1, ## H2, ### H3
                <br />
                • <strong>Format:</strong> **bold**, *italic*, `code`
                <br />
                • <strong>Links:</strong> [text](url), ![alt](image-url)
                <br />
                • <strong>YouTube:</strong> {`<iframe src="https://youtube.com/embed/VIDEO_ID" width="560" height="315"></iframe>`}
                <br />
                • <strong>Video:</strong> {`<video src="video.mp4" controls></video>`}
                <br />
                • <strong>Responsive:</strong> Wrap in {`<div class="video-container">...</div>`} for 16:9
              </Alert>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ⚙️ Publishing Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Published
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Make this article visible to readers
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      color="warning"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Featured
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Show on homepage
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Paper sx={{ p: 3, position: 'sticky', bottom: 20 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/admin')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  px: 4,
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                  },
                }}
              >
                {saving ? 'Saving...' : (isEdit ? 'Update Article' : 'Publish Article')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleEditor;
