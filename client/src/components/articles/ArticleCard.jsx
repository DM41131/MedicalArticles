import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const defaultImage = 'https://via.placeholder.com/400x200?text=No+Image';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea 
        component={Link} 
        to={`/articles/${article.slug || article._id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={article.coverImage || defaultImage}
          alt={article.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {article.category && (
              <Chip
                label={article.category.name}
                size="small"
                sx={{
                  backgroundColor: article.category.color || 'primary.main',
                  color: 'white',
                }}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {article.views || 0}
              </Typography>
            </Box>
          </Box>

          <Typography gutterBottom variant="h6" component="h2">
            {article.title}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {article.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      {/* Footer section - always at the bottom */}
      <Box 
        sx={{ 
          px: 2, 
          py: 1.5, 
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mt: 'auto'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          ავტორი {article.author?.username || 'Unknown'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • {new Date(article.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Card>
  );
};

export default ArticleCard;

