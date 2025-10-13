import { Box } from '@mui/material';

const ArticleCover = ({ image, title }) => {
  if (!image) return null;

  return (
    <Box
      sx={{
        width: '100%',
        height: 400,
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

export default ArticleCover;

