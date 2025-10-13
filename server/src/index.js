import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './utils/error.js';
import { getSSLCredentials, shouldEnableHTTPS } from './config/https.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import navigationRoutes from './routes/navigation.routes.js';
import articlesRoutes from './routes/articles.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect HTTP to HTTPS in production (only if HTTPS is enabled)
if (config.nodeEnv === 'production' && shouldEnableHTTPS()) {
  app.use((req, res, next) => {
    if (req.secure) {
      // Request is already HTTPS
      return next();
    }
    // Redirect to HTTPS
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/articles', articlesRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Serve React App in Production
if (config.nodeEnv === 'production') {
  // Serve static files from the React build folder
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start server(s)
const PORT = config.port;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// Create HTTP server
const httpServer = http.createServer(app);

// Start HTTP server
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Create and start HTTPS server if enabled
if (shouldEnableHTTPS()) {
  const credentials = getSSLCredentials();
  const httpsServer = https.createServer(credentials, app);
  
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running in ${config.nodeEnv} mode on port ${HTTPS_PORT}`);
  });
} else {
  console.log('HTTPS is disabled. Only HTTP server is running.');
  if (config.nodeEnv === 'production') {
    console.log('⚠️  WARNING: Running in production without HTTPS is not recommended!');
  }
}

