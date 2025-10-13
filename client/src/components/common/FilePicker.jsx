import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const FilePicker = ({ label = 'Choose File', accept = 'image/*', onChange, currentFile }) => {
  const [preview, setPreview] = useState(currentFile || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        fullWidth
      >
        {label}
        <input
          type="file"
          hidden
          accept={accept}
          onChange={handleFileChange}
        />
      </Button>
      
      {preview && (
        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              maxWidth: '100%',
              maxHeight: 300,
              borderRadius: 1,
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default FilePicker;

