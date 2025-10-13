import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'rehype-sanitize';
import { Box } from '@mui/material';

// Custom sanitize schema that allows HTML embeds
const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes['*'] || []),
      'className',
      'style',
    ],
    iframe: [
      'src',
      'width',
      'height',
      'frameBorder',
      'allow',
      'allowFullScreen',
      'title',
      'style',
      'className',
    ],
    video: [
      'src',
      'width',
      'height',
      'controls',
      'autoPlay',
      'loop',
      'muted',
      'poster',
      'preload',
      'style',
      'className',
    ],
    audio: [
      'src',
      'controls',
      'autoPlay',
      'loop',
      'muted',
      'preload',
      'style',
      'className',
    ],
    source: ['src', 'type'],
    div: ['className', 'style'],
    span: ['className', 'style'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'iframe',
    'video',
    'audio',
    'source',
    'div',
    'span',
  ],
};

const MarkdownRenderer = ({ content }) => {
  return (
    <Box
      sx={{
        '& h1': {
          fontSize: '2rem',
          fontWeight: 600,
          mt: 3,
          mb: 2,
        },
        '& h2': {
          fontSize: '1.75rem',
          fontWeight: 600,
          mt: 2.5,
          mb: 1.5,
        },
        '& h3': {
          fontSize: '1.5rem',
          fontWeight: 500,
          mt: 2,
          mb: 1,
        },
        '& p': {
          fontSize: '1rem',
          lineHeight: 1.7,
          mb: 2,
        },
        '& ul, & ol': {
          pl: 3,
          mb: 2,
        },
        '& li': {
          mb: 0.5,
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          py: 0.5,
          my: 2,
          fontStyle: 'italic',
          backgroundColor: 'grey.50',
        },
        '& code': {
          backgroundColor: 'grey.100',
          padding: '2px 6px',
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.9em',
        },
        '& pre': {
          backgroundColor: 'grey.900',
          color: 'white',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          mb: 2,
          '& code': {
            backgroundColor: 'transparent',
            color: 'inherit',
            padding: 0,
          },
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 2,
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mb: 2,
        },
        '& th, & td': {
          border: '1px solid',
          borderColor: 'grey.300',
          padding: '8px 12px',
          textAlign: 'left',
        },
        '& th': {
          backgroundColor: 'grey.100',
          fontWeight: 600,
        },
        // Video and iframe styling
        '& iframe': {
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
          minHeight: '400px',
          borderRadius: 1,
          my: 2,
          border: 'none',
        },
        '& video': {
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 2,
        },
        '& audio': {
          width: '100%',
          my: 2,
        },
        // Responsive video container
        '& .video-container': {
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          my: 2,
          '& iframe, & video': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: 'auto',
          },
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, customSchema]]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;

