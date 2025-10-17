import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ArticleCover from '../components/articles/ArticleCover';
import ArticleMeta from '../components/articles/ArticleMeta';
import MarkdownRenderer from '../components/markdown/MarkdownRenderer';
import Comments from '../components/articles/Comments';
import SEO from '../components/common/SEO';
import { api } from '../api/http';

const ArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const viewIncremented = useRef(false);

  useEffect(() => {
    // Reset the view increment flag when the article ID changes
    viewIncremented.current = false;
    
    const fetchArticle = async () => {
      try {
        const response = await api.articles.getById(id);
        setArticle(response.data);
        
        // Increment view count only once
        if (!viewIncremented.current) {
          viewIncremented.current = true;
          await api.articles.incrementView(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Article not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <SEO 
        title={`${article.title} | Medical Articles Georgia`}
        description={article.excerpt || article.content?.substring(0, 160)}
        keywords={article.tags?.join(', ')}
        image={article.coverImage}
        article={true}
        author={article.author?.name}
        publishedTime={article.createdAt}
        modifiedTime={article.updatedAt}
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {article.title}
          </Typography>

        <ArticleMeta article={article} />

        <ArticleCover image={article.coverImage} title={article.title} />

        <MarkdownRenderer content={article.content} />

        {article.tags && article.tags.length > 0 && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {article.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="medium"
                  variant="outlined"
                  color="primary"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Author Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Author
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Avatar
              src={article.author?.avatar}
              alt={article.author?.username}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {article.author?.username || 'Unknown Author'}
              </Typography>
              {article.author?.bio && (
                <Typography variant="body2" color="text.secondary">
                  {article.author.bio}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Sources Section */}
        {article.sources && article.sources.length > 0 && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Sources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              {article.sources.map((source, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    pl: 2,
                    position: 'relative',
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: 0,
                    },
                  }}
                >
                  {source.startsWith('http://') || source.startsWith('https://') ? (
                    <a 
                      href={source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#1976d2',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {source}
                    </a>
                  ) : (
                    source
                  )}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      <Comments articleId={article._id} />
    </Container>
    </>
  );
};

export default ArticleView;

