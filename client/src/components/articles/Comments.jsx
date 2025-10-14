import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  alpha,
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  ThumbUpOutlined as LikeIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { api } from '../../api/http';
import { useAuth } from '../../store/useAuth';

const CommentItem = ({ comment, onDelete, onReply, replyingTo, replyForm }) => {
  const { user } = useAuth();
  
  // Add null checks to prevent errors
  if (!comment || !comment.user) {
    return null; // Don't render if comment or user data is missing
  }
  
  const canDelete = user && (user._id === comment.user._id || user.role === 'admin');
  const isReplying = replyingTo === comment._id;

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    
    return Math.floor(seconds) + 's';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar 
          src={comment.user?.avatar} 
          alt={comment.user?.username || 'User'}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Comment Bubble */}
          <Box
            sx={{
              bgcolor: alpha('#000', 0.05),
              borderRadius: '18px',
              px: 2,
              py: 1.5,
              display: 'inline-block',
              maxWidth: '100%',
              wordWrap: 'break-word',
            }}
          >
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{ mb: 0.5, fontSize: '0.875rem' }}
            >
              {comment.user?.username || 'Anonymous User'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.9375rem',
                lineHeight: 1.4,
                color: 'text.primary',
              }}
            >
              {comment.content || 'Comment content not available'}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, ml: 1.5 }}>
            <Button
              size="small"
              sx={{
                minWidth: 'auto',
                p: 0,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Like
            </Button>
            
            {onReply && (
              <Button
                size="small"
                onClick={() => onReply(comment._id)}
                sx={{
                  minWidth: 'auto',
                  p: 0,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isReplying ? 'primary.main' : 'text.secondary',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Reply
              </Button>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {comment.createdAt ? getTimeAgo(comment.createdAt) : 'Unknown time'}
            </Typography>

            {canDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(comment._id)}
                sx={{ 
                  ml: 'auto',
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {/* Inline Reply Form */}
          {isReplying && replyForm}
        </Box>
      </Box>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: 5, mt: 1.5 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              replyingTo={replyingTo}
              replyForm={replyForm}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const Comments = ({ articleId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const loadComments = async () => {
    try {
      const response = await api.comments.getByArticle(articleId);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await api.comments.create(articleId, {
        content: newComment,
        parentComment: null,
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await api.comments.create(articleId, {
        content: replyContent,
        parentComment: replyTo,
      });
      setReplyContent('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyContent('');
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.comments.delete(articleId, commentId);
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Reply form component
  const ReplyForm = (
    <Box 
      component="form" 
      onSubmit={handleReplySubmit} 
      sx={{ 
        mt: 1.5,
        display: 'flex',
        gap: 1,
        alignItems: 'flex-start',
      }}
    >
      <Avatar 
        src={user?.avatar} 
        alt={user?.username}
        sx={{ width: 32, height: 32 }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Write a reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: alpha('#000', 0.03),
              '&:hover': {
                bgcolor: alpha('#000', 0.05),
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleCancelReply}
            size="small"
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading || !replyContent.trim()}
            sx={{ 
              textTransform: 'none',
              borderRadius: '20px',
              boxShadow: 'none',
            }}
          >
            Reply
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mt: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Comments
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Comment input at the top (Facebook style) */}
      {isAuthenticated && (
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mb: 3,
            alignItems: 'flex-start',
          }}
        >
          <Avatar 
            src={user?.avatar} 
            alt={user?.username}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={6}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: alpha('#000', 0.03),
                  '&:hover': {
                    bgcolor: alpha('#000', 0.05),
                  },
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            />
            {newComment.trim() && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '20px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 1,
                    },
                  }}
                >
                  Post
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {!isAuthenticated && (
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mb: 3,
            p: 2,
            bgcolor: alpha('#000', 0.02),
            borderRadius: 2,
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ width: 40, height: 40 }} />
          <Typography variant="body2" color="text.secondary">
            Please <strong>login</strong> to leave a comment
          </Typography>
        </Box>
      )}

      {/* Show comments */}
      {comments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        </Box>
      ) : (
        <Box>
          {comments
            .filter(comment => comment && comment._id && comment.user) // Filter out invalid comments
            .map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDelete}
                onReply={isAuthenticated ? handleReply : null}
                replyingTo={replyTo}
                replyForm={ReplyForm}
              />
            ))}
        </Box>
      )}
    </Paper>
  );
};

export default Comments;

