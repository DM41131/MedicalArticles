import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArticleCard from '../components/articles/ArticleCard';
import { api } from '../api/http';
import coverImage from '../assets/cover.jpg';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: 10, md: 30 },
      top: '50%',
      transform: 'translate(0, -50%)',
      zIndex: 2,
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      '&:hover': {
        backgroundColor: 'white',
        transform: 'translate(0, -50%) scale(1.1)',
      },
      transition: 'all 0.3s ease',
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: 10, md: 30 },
      top: '50%',
      transform: 'translate(0, -50%)',
      zIndex: 2,
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      '&:hover': {
        backgroundColor: 'white',
        transform: 'translate(0, -50%) scale(1.1)',
      },
      transition: 'all 0.3s ease',
    }}
  >
    <ArrowForwardIosIcon sx={{ transform: 'rotate(180deg)' }} />
    </IconButton>
);

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch featured articles
        const featuredResponse = await api.articles.getAll({
          featured: 'true',
          limit: 5,
        });
        setFeaturedArticles(featuredResponse.data);

        // Fetch recent articles
        const recentResponse = await api.articles.getAll({
          limit: 6,
          sort: '-createdAt',
        });
        setRecentArticles(recentResponse.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: 'slick-dots custom-dots',
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section with Cover Image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '400px', md: '500px' },
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Welcome to Articles Hub
            </Typography>
            <Typography 
              variant="h5" 
              paragraph
              sx={{ 
                mb: 4,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Discover and share knowledge through our collection of articles
            </Typography>
            <Button
              component={Link}
              to="/articles"
              variant="contained"
              size="large"
              sx={{ 
                mt: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Articles
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Featured Articles Carousel */}
      {featuredArticles.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
            <Typography variant="h3" fontWeight="bold">
              Featured Articles
            </Typography>
          </Box>
          
          <Box
            sx={{
              position: 'relative',
              '& .slick-slider': {
                position: 'relative',
              },
              '& .custom-dots': {
                bottom: '-45px',
                '& li': {
                  margin: '0 4px',
                },
                '& li button:before': {
                  fontSize: '12px',
                  color: 'primary.main',
                  opacity: 0.5,
                },
                '& li.slick-active button:before': {
                  color: 'primary.main',
                  opacity: 1,
                },
              },
            }}
          >
            <Slider {...carouselSettings}>
              {featuredArticles.map((article) => (
                <Box key={article._id} sx={{ px: { xs: 1, md: 2 } }}>
                  <Card
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 3,
                     // boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardActionArea component={Link} to={`/articles/${article.slug || article._id}`}>
                      <Grid container>
                        <Grid item xs={12} md={7}>
                          <CardMedia
                            component="img"
                            sx={{
                              height: { xs: 300, md: 450 },
                              width: '100%',
                              objectFit: 'cover',
                            }}
                            image={article.coverImage || 'https://via.placeholder.com/800x450?text=No+Image'}
                            alt={article.title}
                          />
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <CardContent
                            sx={{
                              height: '100%',
                              p: { xs: 3, md: 5 },
                              pb: { xs: 4, md: 6 },
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              variant="h3"
                              component="h2"
                              fontWeight="bold"
                              gutterBottom
                              sx={{
                                fontSize: { xs: '1.2rem', md: '1.7rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                marginBottom: 2,
                                lineHeight: 1.3,
                                pb: 0.5,
                              }}
                            >
                              {article.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                mb: 3,
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp:6,
                                WebkitBoxOrient: 'vertical',
                                pb: 0.5,
                              }}
                            >
                              {article.excerpt}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 'auto' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(article.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VisibilityIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {article.views || 0} views
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      )}

      {/* Recent Articles */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Recent Articles</Typography>
          <Button component={Link} to="/articles">
            View All
          </Button>
        </Box>
        <Grid container spacing={3}>
          {recentArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
    </>
  );
};

export default Home;

