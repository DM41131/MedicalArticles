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
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArticleCard from '../components/articles/ArticleCard';
import SEO from '../components/common/SEO';
import { api } from '../api/http';
import coverImage from '../assets/cover.jpg';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: 10, md: -18 },
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
      left: { xs: 10, md: -18 },
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
  const theme = useTheme();
  const navigate = useNavigate();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalViews: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch popular articles (most viewed)
        const popularResponse = await api.articles.getAll({
          limit: 4,
          sort: '-views',
        });
        setPopularArticles(popularResponse.data);

        // Fetch categories
        const categoriesResponse = await api.categories.getAll();
        const categoriesData = categoriesResponse.data || [];

        // Calculate stats
        const allArticlesResponse = await api.articles.getAll({ limit: 1000 });
        const allArticles = allArticlesResponse.data || [];
        
        // Add article count to each category
        const categoriesWithCount = categoriesData.map(category => {
          const articleCount = allArticles.filter(
            article => article.category && article.category._id === category._id
          ).length;
          return { ...category, articleCount };
        });
        setCategories(categoriesWithCount);
        const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
        
        setStats({
          totalArticles: allArticles.length,
          totalViews: totalViews,
          totalCategories: categoriesResponse.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleCategoryClick = (categoryId) => {
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
    <>
      <SEO 
        title="სამედიცინო სტატიები და კალკულატორები | Medical Articles Georgia"
        description="ქართული სამედიცინო ინფორმაციის პლატფორმა. სამედიცინო სტატიები, კლინიკური კალკულატორები, ჯანმრთელობის რჩევები და მეტი. უახლესი სამედიცინო ინფორმაცია და ექიმების რჩევები."
        keywords="სამედიცინო სტატიები, medical articles, ჯანმრთელობა, health georgia, სამედიცინო კალკულატორები, BMI calculator, ექიმი, doctor, healthcare, medical information"
      />
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
          mb: 0,
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
             მედარეა
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
              აღმოაჩინე და გააზიარე ცონდნა ჩვენი პლათფორმის მეშვეობით
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
              აღმოაჩინე სტატიები
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <ArticleIcon sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {stats.totalArticles}
                </Typography>
                <Typography variant="body2">გამოქვეყნებული სტატიები</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <VisibilityIcon sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {stats.totalViews.toLocaleString()}
                </Typography>
                <Typography variant="body2">სულ ნახვები</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <CategoryIcon sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {stats.totalCategories}
                </Typography>
                <Typography variant="body2">კატეგორიები</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Featured Articles Carousel */}
      {featuredArticles.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
            <Typography variant="h3" fontWeight="bold">
              რჩეული სტატიები
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
                <Box key={article._id}>
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
                              backgroundColor: 'primary.main',
                            }}
                          >
                            <Typography
                              variant="h3"
                              component="h2"
                              fontWeight="bold"
                              gutterBottom
                              sx={{
                                color: 'white',
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
                                color: 'white',
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
                                <AccessTimeIcon fontSize="small" color="action" sx={{ color: 'white' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
                                  {new Date(article.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VisibilityIcon fontSize="small" color="action" sx={{ color: 'white' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
                                  {article.views || 0} ნახვა
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

      {/* Popular/Trending Articles */}
      {popularArticles.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrendingUpIcon sx={{ color: 'error.main', fontSize: 32 }} />
            <Typography variant="h3" fontWeight="bold">
              პოპულარული სტატიები  
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {popularArticles.map((article, index) => (
              <Grid item xs={12} sm={6} md={3} key={article._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 2,
                      backgroundColor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <CardActionArea
                    component={Link}
                    to={`/articles/${article.slug || article._id}`}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={article.coverImage || 'https://via.placeholder.com/400x180?text=No+Image'}
                      alt={article.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontWeight: 600,
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {article.views || 0} ნახვა
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Categories Showcase */}
      {categories.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                lineHeight: 1.5,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              აღმოაჩინე სასურველი თემატიკა
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              სტატიები კლასიფიცირებულია თემატური კატეგორიების მიხედვით 
            </Typography>
          </Box>
          
          <Box
            sx={{
              position: 'relative',
              pt: 2,
              pb: 2,
              '& .slick-slider': {
                position: 'relative',
              },
              '& .slick-list': {
                overflowX: 'hidden',
                overflowY: 'visible',
                margin: '0 -8px',
                padding: '20px 0',
              },
              '& .slick-slide': {
                padding: '0 8px',
              },
              '& .slick-slide > div': {
                height: '100%',
              },
              '& .slick-track': {
                display: 'flex !important',
              },
              '& .category-dots': {
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
            <Slider
              {...{
                dots: true,
                infinite: categories.length > 4,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                pauseOnHover: true,
                nextArrow: <NextArrow />,
                prevArrow: <PrevArrow />,
                dotsClass: 'slick-dots category-dots',
                responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      infinite: categories.length > 3,
                    }
                  },
                  {
                    breakpoint: 900,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      infinite: categories.length > 2,
                    }
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: true,
                      arrows: false,
                    }
                  }
                ]
              }}
            >
              {categories.map((category) => (
                <Box key={category._id}>
                  <Box
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        '& .category-card': {
                         boxShadow: `0 10px 20px ${alpha(category.color || theme.palette.primary.main, 0.3)}`,
                        },
                        '& .category-icon': {
                          transform: 'scale(1.2) rotate(5deg)',
                        },
                        '& .category-count': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <Card
                      className="category-card"
                      elevation={4}
                      sx={{
                        height: 160,
                        background: `linear-gradient(135deg, ${category.color || theme.palette.primary.main} 0%, ${alpha(category.color || theme.palette.primary.main, 0.8)} 100%)`,
                        color: 'white',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box
                            className="category-icon"
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: alpha('#fff', 0.2),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                            }}
                          >
                            {category.icon || category.name.charAt(0)}
                          </Box>
                          <Chip
                            className="category-count"
                            label={category.articleCount || 0}
                            size="small"
                            sx={{
                              bgcolor: alpha('#fff', 0.2),
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            sx={{ 
                              mb: 0.5,
                              fontSize: '1.1rem',
                              lineHeight: 1.2,
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              opacity: 0.9,
                              fontSize: '0.75rem',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {category.description || 'Explore articles'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      )}

      {/* Recent Articles */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">ახალი სტატიები</Typography>
          <Button component={Link} to="/articles">
            ყველა სტატია
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

