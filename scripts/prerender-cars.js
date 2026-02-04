import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html introuvable. Lancez "npm run build" avant le pré-rendu.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fuphindmzbrvlojaneee.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGhpbmRtemJydmxvamFuZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDQ0OTAsImV4cCI6MjA4NTUyMDQ5MH0.bd_TeJa-0JeksI11t68OOHDig1GoVcvAgvxn73sdLy8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const slugify = (value) => {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const formatPrice = (price) => {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const cloudinaryOgImage = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return 'https://voituressenegal.com/og-image.jpg';
  return url.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_jpg/');
};

const replaceTitle = (html, title) => {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const setMeta = (html, attrName, attrValue, content) => {
  const attr = `${attrName}="${attrValue}"`;
  const regex = new RegExp(`<meta\\s+${escapeRegExp(attr)}\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const tag = `<meta ${attr} content="${content}">`;

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace('</head>', `  ${tag}\n</head>`);
};

const setLink = (html, rel, href) => {
  const regex = new RegExp(`<link\\s+rel="${escapeRegExp(rel)}"\\s+href="[^"]*"\\s*\\/?>`, 'i');
  const tag = `<link rel="${rel}" href="${href}">`;

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace('</head>', `  ${tag}\n</head>`);
};

const buildCarHtml = (car) => {
  const marque = car?.marque || 'Voiture';
  const modele = car?.modele || '';
  const annee = car?.annee || '';
  const price = formatPrice(car?.prix);

  const title = `${marque} ${modele} ${annee} - ${price} | Autoboss Sénégal`;
  const description = (car?.description || `${marque} ${modele} ${annee} à ${car?.ville || 'Sénégal'}. ${car?.type || ''} - ${price}.`).substring(0, 160);

  const slug = [slugify(marque), slugify(modele)].filter(Boolean).join('-') || 'voiture';
  const url = `https://voituressenegal.com/voiture/${slug}/${car.id}`;
  const image = cloudinaryOgImage(car?.medias?.[0]);

  let html = template;
  html = replaceTitle(html, title);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:type', 'product');
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:width', '1200');
  html = setMeta(html, 'property', 'og:image:height', '630');
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setLink(html, 'canonical', url);

  const outDir = path.join(distDir, 'voiture', slug, car.id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
};

const run = async () => {
  const { data: cars, error } = await supabase
    .from('cars')
    .select('id, marque, modele, annee, prix, ville, type, description, medias')
    .order('created_at', { ascending: false })
    .range(0, 200);

  if (error) {
    console.error('❌ Erreur Supabase:', error.message);
    process.exit(1);
  }

  if (!cars || cars.length === 0) {
    console.warn('⚠️ Aucune voiture trouvée pour le pré-rendu.');
    return;
  }

  cars.forEach(buildCarHtml);
  console.log(`✅ Pré-rendu terminé: ${cars.length} pages voitures.`);
};

run();
