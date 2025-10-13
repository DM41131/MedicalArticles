import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/articles_db',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  uploadDir: process.env.UPLOAD_DIR || './src/uploads',
  nodeEnv: process.env.NODE_ENV || 'development',
};

