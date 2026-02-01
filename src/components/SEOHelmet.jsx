import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant SEOHelmet - Gère les meta tags de manière centralisée
 * Utilisation: <SEOHelmet title="..." description="..." />
 */
const SEOHelmet = ({ 
  title, 
  description, 
  image = 'https://autoboss.sn/og-image.jpg',
  type = 'website',
  noindex = false 
}) => {
  const location = useLocation();
  const url = `https://autoboss.sn${location.pathname}`;

  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
      
      // OG Title
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('name', 'twitter:title', title);
    }

    // Description
    if (description) {
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:description', description);
    }

    // Image
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('name', 'twitter:image', image);

    // URL
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('name', 'twitter:url', url);

    // Type
    updateMetaTag('property', 'og:type', type);

    // Canonical
    updateCanonical(url);

    // Robots
    if (noindex) {
      updateMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large');
    }
  }, [title, description, image, type, url, noindex]);

  return null;
};

// Helper functions
const updateMetaTag = (attribute, key, content) => {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateCanonical = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
};

export default SEOHelmet;
