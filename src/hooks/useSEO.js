import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour mettre à jour les meta tags dynamiquement
 * Améliore le SEO et Facebook sharing
 */
export const useSEO = ({ title, description, image, url }) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update OG tags (Facebook)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && url) {
      ogUrl.setAttribute('content', url);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && image) {
      // Ensure image is full URL and optimized for Facebook (1200x630)
      const imageUrl = image.startsWith('http') ? image : `https://voituressenegal.com${image}`;
      ogImage.setAttribute('content', imageUrl);
    }

    // Add og:image:width and og:image:height for better Facebook preview
    let ogImageWidth = document.querySelector('meta[property="og:image:width"]');
    if (!ogImageWidth) {
      ogImageWidth = document.createElement('meta');
      ogImageWidth.setAttribute('property', 'og:image:width');
      ogImageWidth.setAttribute('content', '1200');
      document.head.appendChild(ogImageWidth);
    }

    let ogImageHeight = document.querySelector('meta[property="og:image:height"]');
    if (!ogImageHeight) {
      ogImageHeight = document.createElement('meta');
      ogImageHeight.setAttribute('property', 'og:image:height');
      ogImageHeight.setAttribute('content', '630');
      document.head.appendChild(ogImageHeight);
    }

    // Update Twitter Card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && image) {
      const imageUrl = image.startsWith('http') ? image : `https://voituressenegal.com${image}`;
      twitterImage.setAttribute('content', imageUrl);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (url) {
      canonical.setAttribute('href', url);
    }
  }, [title, description, image, url, location]);
};

/**
 * Fonction pour ajouter des structured data (JSON-LD) dynamiquement
 */
export const addStructuredData = (data) => {
  // Remove existing structured data with same type
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => {
    try {
      const scriptData = JSON.parse(script.textContent);
      if (scriptData['@type'] === data['@type']) {
        script.remove();
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Structured data pour un produit (voiture)
 */
export const createProductSchema = (car) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${car.marque} ${car.modele}`,
  image: car.medias || [],
  description: car.description || `${car.marque} ${car.modele} ${car.annee}`,
  brand: {
    '@type': 'Brand',
    name: car.marque
  },
  offers: {
    '@type': 'Offer',
    url: `https://voituressenegal.com/voiture/${car.marque?.toLowerCase().replace(/\s+/g, '-')}-${car.modele?.toLowerCase().replace(/\s+/g, '-')}/${car.id}`,
    priceCurrency: 'XOF',
    price: car.prix,
    availability: car.status === 'acheté' 
      ? 'https://schema.org/OutOfStock' 
      : 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Autoboss Sénégal'
    }
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Année',
      value: car.annee
    },
    {
      '@type': 'PropertyValue',
      name: 'Carburant',
      value: car.carburant
    },
    {
      '@type': 'PropertyValue',
      name: 'Boîte',
      value: car.boite
    },
    {
      '@type': 'PropertyValue',
      name: 'Ville',
      value: car.ville
    }
  ]
});

/**
 * Structured data pour une liste de produits
 */
export const createItemListSchema = (cars, listName = 'Voitures disponibles') => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: listName,
  numberOfItems: cars.length,
  itemListElement: cars.slice(0, 20).map((car, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: `${car.marque} ${car.modele}`,
      url: `https://voituressenegal.com/voiture/${car.marque?.toLowerCase().replace(/\s+/g, '-')}-${car.modele?.toLowerCase().replace(/\s+/g, '-')}/${car.id}`,
      image: car.medias?.[0],
      offers: {
        '@type': 'Offer',
        price: car.prix,
        priceCurrency: 'XOF'
      }
    }
  }))
});
