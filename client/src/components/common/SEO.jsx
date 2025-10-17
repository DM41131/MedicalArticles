import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for dynamic meta tags
 * Updates document head with page-specific SEO information
 */
const SEO = ({ 
  title, 
  description, 
  keywords,
  image,
  article = false,
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl
}) => {
  const location = useLocation();
  const baseUrl = 'http://dla.ge';
  const currentUrl = `${baseUrl}${location.pathname}`;
  const defaultImage = `${baseUrl}/og-image.jpg`;

  // Default values
  const metaTitle = title || 'სამედიცინო სტატიები და კალკულატორები | Medical Articles Georgia';
  const metaDescription = description || 'ქართული სამედიცინო ინფორმაციის პლატფორმა. სამედიცინო სტატიები, კლინიკური კალკულატორები, ჯანმრთელობის რჩევები და მეტი.';
  const metaKeywords = keywords || 'სამედიცინო სტატიები, medical articles, ჯანმრთელობა, health georgia';
  const metaImage = image || defaultImage;
  const canonical = canonicalUrl || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

    // Update or create meta tags
    const updateMeta = (property, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMeta('description', metaDescription);
    updateMeta('keywords', metaKeywords);

    // Update Open Graph tags
    updateMeta('og:title', metaTitle, true);
    updateMeta('og:description', metaDescription, true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:image', metaImage, true);
    updateMeta('og:type', article ? 'article' : 'website', true);

    // Update Twitter Card tags
    updateMeta('twitter:title', metaTitle, true);
    updateMeta('twitter:description', metaDescription, true);
    updateMeta('twitter:url', currentUrl, true);
    updateMeta('twitter:image', metaImage, true);

    // Article-specific meta tags
    if (article) {
      if (author) updateMeta('article:author', author, true);
      if (publishedTime) updateMeta('article:published_time', publishedTime, true);
      if (modifiedTime) updateMeta('article:modified_time', modifiedTime, true);
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonical);
      document.head.appendChild(canonicalLink);
    }

    // Add structured data for articles
    if (article) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalScholarlyArticle",
        "headline": metaTitle,
        "description": metaDescription,
        "image": metaImage,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
          "@type": "Person",
          "name": author || "Medical Articles Georgia"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Medical Articles Georgia",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        }
      };

      let scriptTag = document.querySelector('script[data-schema="article"]');
      if (scriptTag) {
        scriptTag.textContent = JSON.stringify(structuredData);
      } else {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('data-schema', 'article');
        scriptTag.textContent = JSON.stringify(structuredData);
        document.head.appendChild(scriptTag);
      }
    }
  }, [metaTitle, metaDescription, metaKeywords, metaImage, currentUrl, canonical, article, author, publishedTime, modifiedTime, baseUrl]);

  return null; // This component doesn't render anything
};

export default SEO;

