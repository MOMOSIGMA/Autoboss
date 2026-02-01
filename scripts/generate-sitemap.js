/**
 * Script pour générer le sitemap dynamiquement
 * À exécuter avec: node scripts/generate-sitemap.js
 * 
 * Ce script récupère toutes les voitures de Supabase et génère un sitemap complet
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const SUPABASE_URL = 'https://fuphindmzbrvlojaneee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGhpbmRtemJydmxvamFuZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDQ0OTAsImV4cCI6MjA4NTUyMDQ5MH0.bd_TeJa-0JeksI11t68OOHDig1GoVcvAgvxn73sdLy8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Pages statiques
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/achat', priority: '0.9', changefreq: 'daily' },
  { url: '/location', priority: '0.9', changefreq: 'daily' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/favorites', priority: '0.6', changefreq: 'weekly' },
  { url: '/partners', priority: '0.5', changefreq: 'monthly' }
];

const generateSitemap = async () => {
  try {
    // Récupérer toutes les voitures
    const { data: cars, error } = await supabase
      .from('cars')
      .select('id, updated_at');

    if (error) {
      console.error('Erreur Supabase:', error);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Générer le XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Pages statiques -->
`;

    // Ajouter les pages statiques
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>https://autoboss.sn${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  
`;
    });

    // Ajouter les pages de voitures
    sitemap += `  <!-- Pages de voitures dynamiques -->
`;
    
    if (cars && cars.length > 0) {
      cars.forEach(car => {
        const lastmod = car.updated_at 
          ? new Date(car.updated_at).toISOString().split('T')[0]
          : today;
        
        sitemap += `  <url>
    <loc>https://autoboss.sn/details/${car.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
      });
    }

    sitemap += `</urlset>`;

    // Écrire le fichier
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap généré avec succès!`);
    console.log(`📄 ${staticPages.length + (cars?.length || 0)} URLs ajoutées`);
    console.log(`📍 Fichier: ${sitemapPath}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
  }
};

// Exécuter
generateSitemap();
