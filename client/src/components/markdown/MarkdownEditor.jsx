import { useState } from 'react';
import { Box, TextField, Paper, Typography, Tabs, Tab } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer';

const MarkdownEditor = ({ value, onChange, label = 'Content' }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Edit" />
        <Tab label="Preview" />
        <Tab label="Split View" />
      </Tabs>

      {activeTab === 0 && (
        <TextField
          fullWidth
          multiline
          rows={20}
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="outlined"
          placeholder="Write your markdown content here..."
          sx={{
            '& .MuiInputBase-root': {
              fontFamily: 'monospace',
            },
          }}
        />
      )}

      {activeTab === 1 && (
        <Paper variant="outlined" sx={{ p: 3, minHeight: 400 }}>
          <MarkdownRenderer content={value} />
        </Paper>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Editor
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              variant="outlined"
              placeholder="Write your markdown content here..."
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, minHeight: 400 }}>
              <MarkdownRenderer content={value} />
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MarkdownEditor;

