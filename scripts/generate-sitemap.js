import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur : Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies dans le fichier .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const baseUrl = 'https://autoboss.vercel.app'; // Utilisation du domaine Vercel temporaire

async function generateSitemap() {
  try {
    const { data: cars, error } = await supabase.from('cars').select('id, marque, modele, annee, ville');
    if (error) {
      console.error('Erreur lors de la récupération des voitures:', error.message);
      return;
    }

    const staticPages = [
      '/',
      '/achat',
      '/location',
      '/favorites',
      '/contact',
      '/terms-of-use',
      '/blog',
      '/blog/conseils-pour-acheter-une-voiture-doccasion',
      '/blog/comment-louer-une-voiture-au-senegal',
    ];

    const carUrls = cars.map(car => {
      const slug = `${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}`;
      return `${baseUrl}/voiture/${slug}/${car.id}`;
    });

    const allUrls = [...staticPages.map(page => `${baseUrl}${page}`), ...carUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log('Sitemap généré avec succès !');
  } catch (err) {
    console.error('Erreur lors de la génération du sitemap:', err.message);
  }
}

generateSitemap();