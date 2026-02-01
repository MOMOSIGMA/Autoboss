/**
 * Script de vérification SEO automatique
 * Exécuter: node scripts/check-seo.js
 */

import fs from 'fs';
import path from 'path';

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('🔍 Vérification SEO Autoboss...\n');

// 1. Vérifier l'existence des fichiers critiques
const criticalFiles = [
  'public/sitemap.xml',
  'public/robots.txt',
  'public/manifest.json',
  'public/browserconfig.xml'
];

console.log('📁 Fichiers critiques:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.passed.push(`✅ ${file} existe`);
    console.log(`  ✅ ${file}`);
  } else {
    checks.failed.push(`❌ ${file} manquant`);
    console.log(`  ❌ ${file} manquant`);
  }
});

// 2. Vérifier index.html
console.log('\n📄 index.html:');
try {
  const indexContent = fs.readFileSync('index.html', 'utf8');
  
  // Meta tags essentiels
  const metaChecks = [
    { name: 'title', regex: /<title>.*<\/title>/, message: 'Title tag' },
    { name: 'description', regex: /<meta name="description"/, message: 'Meta description' },
    { name: 'og:title', regex: /<meta property="og:title"/, message: 'Open Graph title' },
    { name: 'og:description', regex: /<meta property="og:description"/, message: 'Open Graph description' },
    { name: 'og:image', regex: /<meta property="og:image"/, message: 'Open Graph image' },
    { name: 'twitter:card', regex: /<meta name="twitter:card"/, message: 'Twitter Card' },
    { name: 'canonical', regex: /<link rel="canonical"/, message: 'Canonical URL' },
    { name: 'json-ld', regex: /<script type="application\/ld\+json">/, message: 'Structured Data (JSON-LD)' }
  ];
  
  metaChecks.forEach(check => {
    if (check.regex.test(indexContent)) {
      checks.passed.push(`✅ ${check.message}`);
      console.log(`  ✅ ${check.message}`);
    } else {
      checks.failed.push(`❌ ${check.message} manquant`);
      console.log(`  ❌ ${check.message} manquant`);
    }
  });
  
  // Vérifier le lang
  if (/<html lang="fr">/.test(indexContent)) {
    checks.passed.push('✅ Attribut lang="fr"');
    console.log('  ✅ Attribut lang="fr"');
  } else {
    checks.failed.push('❌ Attribut lang manquant ou incorrect');
    console.log('  ❌ Attribut lang manquant');
  }
  
} catch (error) {
  checks.failed.push('❌ Erreur lecture index.html');
  console.log('  ❌ Erreur lecture index.html');
}

// 3. Vérifier robots.txt
console.log('\n🤖 robots.txt:');
try {
  const robotsContent = fs.readFileSync('public/robots.txt', 'utf8');
  
  if (/Allow: \//.test(robotsContent)) {
    checks.passed.push('✅ Allow: / présent');
    console.log('  ✅ Allow: / présent');
  } else {
    checks.warnings.push('⚠️  Allow: / non trouvé');
    console.log('  ⚠️  Allow: / non trouvé');
  }
  
  if (/Sitemap:/.test(robotsContent)) {
    checks.passed.push('✅ Sitemap référencé');
    console.log('  ✅ Sitemap référencé');
  } else {
    checks.failed.push('❌ Sitemap non référencé');
    console.log('  ❌ Sitemap non référencé');
  }
} catch (error) {
  checks.failed.push('❌ Erreur lecture robots.txt');
  console.log('  ❌ Erreur lecture robots.txt');
}

// 4. Vérifier sitemap.xml
console.log('\n🗺️  sitemap.xml:');
try {
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8');
  
  const urlMatches = sitemapContent.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  if (urlCount > 0) {
    checks.passed.push(`✅ ${urlCount} URLs dans le sitemap`);
    console.log(`  ✅ ${urlCount} URLs dans le sitemap`);
  } else {
    checks.warnings.push('⚠️  Aucune URL dans le sitemap');
    console.log('  ⚠️  Aucune URL dans le sitemap');
  }
  
  if (/<loc>https:\/\/autoboss\.sn\/<\/loc>/.test(sitemapContent)) {
    checks.passed.push('✅ URL de base présente');
    console.log('  ✅ URL de base présente');
  } else {
    checks.failed.push('❌ URL de base manquante');
    console.log('  ❌ URL de base manquante');
  }
} catch (error) {
  checks.failed.push('❌ Erreur lecture sitemap.xml');
  console.log('  ❌ Erreur lecture sitemap.xml');
}

// 5. Vérifier manifest.json
console.log('\n📱 manifest.json:');
try {
  const manifestContent = fs.readFileSync('public/manifest.json', 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  const manifestChecks = [
    { key: 'name', message: 'Name' },
    { key: 'short_name', message: 'Short name' },
    { key: 'description', message: 'Description' },
    { key: 'start_url', message: 'Start URL' },
    { key: 'icons', message: 'Icons' }
  ];
  
  manifestChecks.forEach(check => {
    if (manifest[check.key]) {
      checks.passed.push(`✅ ${check.message}`);
      console.log(`  ✅ ${check.message}`);
    } else {
      checks.failed.push(`❌ ${check.message} manquant`);
      console.log(`  ❌ ${check.message} manquant`);
    }
  });
} catch (error) {
  checks.failed.push('❌ Erreur lecture manifest.json');
  console.log('  ❌ Erreur lecture manifest.json');
}

// 6. Vérifier les hooks SEO
console.log('\n🔗 Hooks & Components SEO:');
const seoFiles = [
  'src/hooks/useSEO.js',
  'src/components/SEOHelmet.jsx',
  'src/config/seo.js'
];

seoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.passed.push(`✅ ${file} existe`);
    console.log(`  ✅ ${file}`);
  } else {
    checks.warnings.push(`⚠️  ${file} manquant (optionnel mais recommandé)`);
    console.log(`  ⚠️  ${file} manquant`);
  }
});

// Résumé final
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ:');
console.log('='.repeat(50));
console.log(`✅ Tests réussis: ${checks.passed.length}`);
console.log(`⚠️  Avertissements: ${checks.warnings.length}`);
console.log(`❌ Tests échoués: ${checks.failed.length}`);

const total = checks.passed.length + checks.warnings.length + checks.failed.length;
const score = Math.round((checks.passed.length / total) * 100);

console.log('\n🎯 SCORE SEO:');
if (score >= 90) {
  console.log(`🌟 ${score}/100 - EXCELLENT!`);
} else if (score >= 70) {
  console.log(`✅ ${score}/100 - BON`);
} else if (score >= 50) {
  console.log(`⚠️  ${score}/100 - MOYEN`);
} else {
  console.log(`❌ ${score}/100 - À AMÉLIORER`);
}

// Recommandations
if (checks.failed.length > 0) {
  console.log('\n❌ À CORRIGER:');
  checks.failed.forEach(item => console.log(`  ${item}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  RECOMMANDATIONS:');
  checks.warnings.forEach(item => console.log(`  ${item}`));
}

console.log('\n📚 Pour plus d\'infos: voir SEO-GUIDE.md');
console.log('='.repeat(50) + '\n');

// Exit code
process.exit(checks.failed.length > 0 ? 1 : 0);
