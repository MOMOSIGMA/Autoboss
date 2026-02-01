/**
 * Configuration SEO centralisée
 * Modifiez ces valeurs selon vos besoins
 */

export const SEO_CONFIG = {
  // Informations du site
  siteName: 'Autoboss Sénégal',
  siteUrl: 'https://autoboss.sn',
  
  // Meta tags par défaut
  defaultTitle: 'Autoboss - Vente et Location de Voitures au Sénégal | Dakar, Thiès',
  defaultDescription: 'Découvrez les meilleures offres de vente et location de voitures au Sénégal. Véhicules neufs et d\'occasion à Dakar, Thiès. Prix compétitifs, qualité garantie. 🚗',
  defaultImage: '/og-image.jpg',
  
  // Social Media
  social: {
    facebook: 'https://facebook.com/autoboss',
    tiktok: 'https://www.tiktok.com/@marchenet_afrique',
    whatsapp: '+221XXXXXXXXX' // Remplacez par votre numéro
  },
  
  // Contact
  contact: {
    phone: '+221XXXXXXXXX',
    email: 'contact@autoboss.sn',
    address: {
      street: 'Dakar',
      city: 'Dakar',
      country: 'Sénégal',
      countryCode: 'SN'
    }
  },
  
  // SEO Keywords
  keywords: [
    'voitures Sénégal',
    'vente voitures Dakar',
    'location voitures Thiès',
    'Autoboss Sénégal',
    'achat voiture Dakar',
    'véhicules occasion Sénégal',
    'location voiture pas cher',
    'voiture neuve Sénégal',
    'concessionnaire Dakar',
    'garage automobile Sénégal'
  ],
  
  // Pages SEO
  pages: {
    home: {
      title: 'Autoboss - Vente et Location de Voitures au Sénégal',
      description: 'Découvrez les meilleures offres de vente et location de voitures au Sénégal. Prix compétitifs, qualité garantie.',
      path: '/'
    },
    achat: {
      title: 'Voitures à Vendre au Sénégal | Autoboss',
      description: 'Achetez votre voiture neuve ou d\'occasion au Sénégal. Large choix de véhicules à Dakar et Thiès.',
      path: '/achat'
    },
    location: {
      title: 'Location de Voitures au Sénégal | Autoboss',
      description: 'Louez votre voiture au Sénégal. Tarifs compétitifs, service de qualité à Dakar et Thiès.',
      path: '/location'
    },
    contact: {
      title: 'Contactez-nous | Autoboss',
      description: 'Contactez Autoboss pour toutes vos questions sur la vente et location de voitures au Sénégal.',
      path: '/contact'
    },
    favorites: {
      title: 'Mes Favoris | Autoboss',
      description: 'Retrouvez toutes vos voitures favorites sur Autoboss.',
      path: '/favorites'
    }
  }
};

/**
 * Génère l'URL complète d'une page
 */
export const getFullUrl = (path) => {
  return `${SEO_CONFIG.siteUrl}${path}`;
};

/**
 * Génère les meta tags pour une page
 */
export const getPageSEO = (pageName) => {
  const page = SEO_CONFIG.pages[pageName];
  if (!page) {
    return {
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
      url: SEO_CONFIG.siteUrl
    };
  }
  
  return {
    title: page.title,
    description: page.description,
    url: getFullUrl(page.path),
    image: getFullUrl(SEO_CONFIG.defaultImage)
  };
};
