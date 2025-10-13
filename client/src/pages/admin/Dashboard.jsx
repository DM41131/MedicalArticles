import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Divider,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/http';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: `0 8px 24px ${alpha(color, 0.25)}`,
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 56,
            height: 56,
          }}
        >
          <Icon fontSize="large" />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalViews: 0,
    publishedArticles: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch recent articles for the dashboard
      const articlesResponse = await api.articles.getAll({
        published: 'all',
        limit: 10,
        sort: '-createdAt',
      });
      setArticles(articlesResponse.data);

      // Fetch categories for stats
      const categoriesResponse = await api.categories.getAll();
      
      const totalViews = articlesResponse.data.reduce(
        (sum, article) => sum + (article.views || 0),
        0
      );

      const publishedCount = articlesResponse.data.filter(a => a.published).length;

      setStats({
        totalArticles: articlesResponse.pagination.total,
        totalCategories: categoriesResponse.data.length,
        totalViews,
        publishedArticles: publishedCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your articles.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Articles"
              value={stats.totalArticles}
              icon={ArticleIcon}
              color="#1976d2"
              subtitle={`${stats.publishedArticles} published`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Categories"
              value={stats.totalCategories}
              icon={CategoryIcon}
              color="#9c27b0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Views"
              value={stats.totalViews.toLocaleString()}
              icon={VisibilityIcon}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg. Views"
              value={stats.totalArticles > 0 ? Math.round(stats.totalViews / stats.totalArticles) : 0}
              icon={TrendingUpIcon}
              color="#ed6c02"
              subtitle="per article"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/admin/articles"
                  startIcon={<ArticleIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Manage Articles
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/admin/articles/new"
                  startIcon={<AddIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Create Article
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/admin/categories"
                  startIcon={<CategoryIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Manage Categories
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/admin/navigation"
                  startIcon={<MenuIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Edit Navigation
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/articles"
                  startIcon={<VisibilityIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  View Public Site
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Articles */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Articles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {articles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No articles yet
                </Typography>
              </Box>
            ) : (
              <Box>
                {articles.slice(0, 5).map((article) => (
                  <Box
                    key={article._id}
                    sx={{
                      py: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          label={article.category.name}
                          sx={{
                            height: 18,
                            fontSize: '0.7rem',
                            bgcolor: alpha(article.category.color, 0.1),
                            color: article.category.color,
                          }}
                        />
                        <Chip
                          size="small"
                          label={article.published ? 'Published' : 'Draft'}
                          color={article.published ? 'success' : 'default'}
                          sx={{ height: 18, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/articles/${article._id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to="/admin/articles"
                    size="small"
                    endIcon={<ArticleIcon />}
                  >
                    View All Articles
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
