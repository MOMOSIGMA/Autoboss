// src/utils/helpers.js - Fonctions utilitaires partagées

/**
 * Formate un prix en FCFA avec espaces
 * @param {number} price - Prix à formater
 * @returns {string} Prix formaté (ex: "2 500 000 FCFA")
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0 FCFA';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

/**
 * Transforme une URL Cloudinary pour optimiser les images
 * @param {string} url - URL Cloudinary originale
 * @param {object} options - Options de transformation
 * @returns {string} URL transformée
 */
export const transformCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  
  const {
    width = 800,
    height = null,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  let transformation = `/upload/w_${width}`;
  if (height) transformation += `,h_${height}`;
  transformation += `,c_${crop},q_${quality},f_${format}/`;

  return url.replace('/upload/', transformation);
};

/**
 * Transforme URL Cloudinary pour miniatures
 */
export const getCloudinaryThumbnail = (url) => 
  transformCloudinaryUrl(url, { width: 300, height: 200, quality: 'auto:low', format: 'webp' });

/**
 * Transforme URL Cloudinary pour images pleine résolution
 */
export const getCloudinaryFullSize = (url) => 
  transformCloudinaryUrl(url, { width: 800, quality: 'auto', format: 'auto' });

/**
 * Débounce une fonction (performance pour recherche)
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Génère un slug SEO-friendly depuis une chaîne
 * @param {string} text - Texte à slugifier
 * @returns {string} Slug généré
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Génère l'URL d'une voiture
 * @param {object} car - Objet voiture
 * @returns {string} URL de la voiture
 */
export const getCarUrl = (car) => {
  const marqueSlug = slugify(car.marque);
  const modeleSlug = slugify(car.modele);
  return `/voiture/${marqueSlug}-${modeleSlug}/${car.id}`;
};

/**
 * Vérifie si une URL est une vidéo
 * @param {string} url - URL à vérifier
 * @returns {boolean} True si vidéo
 */
export const isVideoUrl = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

/**
 * Retourne le numéro de téléphone formaté pour WhatsApp
 * @param {string} phoneNumber - Numéro de téléphone
 * @returns {string} Numéro formaté
 */
export const formatPhoneForWhatsApp = (phoneNumber) => {
  return phoneNumber.replace(/[^0-9+]/g, '');
};

/**
 * Log console seulement en développement
 * @param {...any} args - Arguments à logger
 */
export const devLog = (...args) => {
  if (import.meta.env.MODE === 'development') {
    console.log(...args);
  }
};

/**
 * Gère les erreurs de manière centralisée
 * @param {Error} error - Erreur à gérer
 * @param {string} context - Contexte de l'erreur
 */
export const handleError = (error, context = '') => {
  if (import.meta.env.MODE === 'development') {
    console.error(`[${context}]`, error);
  }
  // Ici on pourrait envoyer à Sentry ou autre service
  return error.message || 'Une erreur est survenue';
};
