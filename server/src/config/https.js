import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load SSL/TLS certificates for HTTPS
 * Place your certificate files in server/certs/ directory
 */
export const getSSLCredentials = () => {
  try {
    const certPath = path.join(__dirname, '../../certs');
    
    // Check if certificates exist
    const keyPath = path.join(certPath, 'privkey.pem');
    const certFilePath = path.join(certPath, 'fullchain.pem');
    
    if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath)) {
      console.log('SSL certificates not found. HTTPS will not be available.');
      return null;
    }

    return {
      key: fs.readFileSync(keyPath, 'utf8'),
      cert: fs.readFileSync(certFilePath, 'utf8'),
    };
  } catch (error) {
    console.error('Error loading SSL certificates:', error);
    return null;
  }
};

/**
 * Check if HTTPS should be enabled
 */
export const shouldEnableHTTPS = () => {
  return process.env.ENABLE_HTTPS === 'true' && getSSLCredentials() !== null;
};

