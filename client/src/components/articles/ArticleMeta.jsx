import { Box, Typography, Chip } from '@mui/material';
import { Visibility, CalendarToday } from '@mui/icons-material';

const ArticleMeta = ({ article }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {article.category && (
          <Chip
            label={article.category.name}
            sx={{
              backgroundColor: article.category.color || 'primary.main',
              color: 'white',
            }}
          />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Visibility fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {article.views || 0} views
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {new Date(article.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ArticleMeta;

