import express from 'express';
import { generateSitemap } from '../utils/sitemapGenerator.js';
import { config } from '../config/env.js';

const router = express.Router();

// GET /api/sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = config.clientUrl || 'http://dla.ge';
    const sitemap = await generateSitemap(baseUrl);
    
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;

