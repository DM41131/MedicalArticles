// Optional markdown validation/sanitization service
// For now, this is a stub that can be extended later

export const validateMarkdown = (content) => {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  // Basic validation - can be extended with more sophisticated checks
  return content.length > 0;
};

export const sanitizeMarkdown = (content) => {
  // For now, just return the content as-is
  // In production, you might want to sanitize HTML tags, scripts, etc.
  return content;
};

export const generateExcerpt = (content, maxLength = 200) => {
  if (!content) return '';
  
  // Remove markdown syntax
  const plainText = content
    .replace(/[#*`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
};

