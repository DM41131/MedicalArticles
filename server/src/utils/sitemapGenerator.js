import Article from '../models/Article.js';
import Category from '../models/Category.js';

/**
 * Generate XML sitemap for the website
 */
export const generateSitemap = async (baseUrl = 'http://dla.ge') => {
  try {
    // Get all published articles
    const articles = await Article.find({ status: 'published' })
      .select('slug updatedAt')
      .sort({ updatedAt: -1 });

    // Get all categories
    const categories = await Category.find()
      .select('slug updatedAt')
      .sort({ updatedAt: -1 });

    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/articles', changefreq: 'daily', priority: '0.9' },
      { url: '/categories', changefreq: 'weekly', priority: '0.8' },
      { url: '/calculators', changefreq: 'monthly', priority: '0.9' },
      { url: '/search', changefreq: 'weekly', priority: '0.7' },
    ];

    // Calculator pages
    const calculators = [
      'bmi',
      'heart-risk',
      'blood-pressure',
      'diabetes-risk',
      'pregnancy',
      'medication-dosage',
      'creatinine-clearance',
      'calorie',
      'mental-health',
      'vaccination',
      'drug-interaction',
      'age',
      'wells-dvt',
      'glasgow-coma-scale',
      'gupta-mica',
    ];

    const calculatorPages = calculators.map(calc => ({
      url: `/calculators/${calc}`,
      changefreq: 'monthly',
      priority: '0.8',
    }));

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    });

    // Add calculator pages
    calculatorPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add category pages
    categories.forEach(category => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/categories/${category.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    });

    // Add article pages
    articles.forEach(article => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/articles/${article.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <lastmod>${article.updatedAt.toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

