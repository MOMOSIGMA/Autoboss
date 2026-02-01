# 🔄 GUIDE DE RESTAURATION SUPABASE - AUTOBOSS

## 📋 SITUATION
Votre projet Supabase a été mis en pause. Ce guide vous aide à le restaurer.

---

## ✅ ÉTAPES RAPIDES (10 minutes)

### 1. Réactiver le Projet Existant

**Si votre projet existe encore:**

1. Allez sur: https://supabase.com/dashboard/projects
2. Trouvez votre projet Autoboss (il aura un badge "Paused")
3. Cliquez sur le projet
4. Cliquez le bouton **"Restore project"** ou **"Unpause"**
5. Attendez 30 secondes
6. ✅ C'est fait! Votre projet est réactivé

**Important**: Sur le plan gratuit, les projets se mettent en pause après 7 jours d'inactivité. Connectez-vous régulièrement pour éviter ça.

---

### 2. Si le Projet a été Supprimé (Restauration Complète)

#### A. Créer un Nouveau Projet

```
1. https://supabase.com/dashboard
2. Cliquez "New Project"
3. Remplissez:
   - Organization: votre org
   - Name: autoboss-2026
   - Database Password: [CRÉEZ UN MOT DE PASSE FORT - NOTEZ-LE!]
   - Region: Europe West (Frankfurt) - Le plus proche du Sénégal
4. Cliquez "Create new project"
5. Attendez 2 minutes ☕
```

#### B. Récupérer les Nouvelles Credentials

Une fois créé:
```
1. Allez dans Settings → API
2. Copiez:
   - Project URL
   - anon/public key
   - service_role key (pour l'admin)
```

#### C. Mettre à Jour votre Config

```bash
# Dans c:\Autoboss\src\config\supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://[VOTRE-NOUVEAU-PROJECT-REF].supabase.co'
const supabaseAnonKey = '[VOTRE-NOUVELLE-ANON-KEY]'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### D. Restaurer le Backup

**Méthode 1: Via le Dashboard (PLUS SIMPLE)**

```
1. Dashboard → SQL Editor
2. Cliquez "New query"
3. Ouvrez votre fichier backup dans un éditeur de texte
4. Copiez TOUT le contenu SQL
5. Collez dans le SQL Editor
6. Cliquez "Run"
7. Attendez que ça s'exécute
8. ✅ Terminé!
```

**Méthode 2: Via Supabase CLI**

```powershell
# 1. Installer Supabase CLI
npm install -g supabase

# 2. Se connecter
supabase login

# 3. Extraire le backup (si .gz)
# Utilisez 7-Zip ou WinRAR pour extraire le fichier .gz
# Vous obtiendrez un fichier .sql ou .backup

# 4. Restaurer
# Obtenez votre Connection String dans Dashboard → Settings → Database
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" < votre-backup.sql
```

---

## 🔧 COMMANDES UTILES

### Vérifier la connexion Supabase
```bash
cd c:\Autoboss
npm run dev

# Ouvrez http://localhost:5173
# Vérifiez que les voitures s'affichent
```

### Tester la base de données
```sql
-- Dans SQL Editor, testez:
SELECT * FROM cars LIMIT 5;
```

### Reconfigurer le sitemap
```bash
# Éditez scripts/generate-sitemap.js
# Mettez vos nouvelles credentials
# Puis:
npm run seo:sitemap
```

---

## 🚨 PROBLÈMES COURANTS

### "Project is paused"
**Solution**: Cliquez simplement sur "Restore" dans le dashboard

### "Cannot connect to database"
**Solution**: 
1. Vérifiez que le projet est actif (pas en pause)
2. Vérifiez vos credentials dans `src/config/supabase.js`
3. Vérifiez que l'URL et la key sont correctes

### "Backup file is corrupted"
**Solution**: 
1. Re-téléchargez le backup depuis Supabase
2. Vérifiez que le fichier .gz est complet
3. Extrayez avec 7-Zip

### "SQL Error during restore"
**Solution**: 
1. Créez d'abord les tables manuellement
2. Puis restaurez uniquement les données
3. Ou contactez le support Supabase

---

## 📋 STRUCTURE DE LA BASE DE DONNÉES

Votre projet Autoboss utilise principalement la table `cars`:

```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marque TEXT,
  modele TEXT,
  annee INTEGER,
  prix NUMERIC,
  type TEXT, -- 'Achat' ou 'Location'
  sousType TEXT,
  carburant TEXT,
  boite TEXT,
  ville TEXT,
  description TEXT,
  status TEXT, -- 'disponible' ou 'acheté'
  medias TEXT[], -- Array d'URLs d'images
  sellerNumber TEXT,
  provenance TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour la performance
CREATE INDEX idx_cars_type ON cars(type);
CREATE INDEX idx_cars_ville ON cars(ville);
CREATE INDEX idx_cars_marque ON cars(marque);
```

---

## ✅ CHECKLIST APRÈS RESTAURATION

- [ ] Projet Supabase actif (pas en pause)
- [ ] Credentials mises à jour dans `src/config/supabase.js`
- [ ] Table `cars` existe et contient des données
- [ ] Le site `npm run dev` fonctionne
- [ ] Les voitures s'affichent sur la page d'accueil
- [ ] La recherche fonctionne
- [ ] Les filtres fonctionnent
- [ ] Les détails de voiture s'affichent
- [ ] Le contact WhatsApp fonctionne
- [ ] L'admin peut ajouter/modifier des voitures

---

## 🎯 PRÉVENIR LES PAUSES FUTURES

### Plan Gratuit
- Se connecte au dashboard au moins 1 fois par semaine
- Ou upgrade vers le plan Pro ($25/mois)

### Plan Pro
- Pas de pause automatique
- Meilleures performances
- Plus de stockage
- Support prioritaire

---

## 📞 BESOIN D'AIDE?

### Support Supabase
- Discord: https://discord.supabase.com
- Email: support@supabase.io
- Docs: https://supabase.com/docs

### Documentation Supabase
- Backup & Restore: https://supabase.com/docs/guides/platform/backups
- CLI: https://supabase.com/docs/guides/cli
- Database: https://supabase.com/docs/guides/database

---

## 🔐 SÉCURITÉ

**IMPORTANT**: Après restauration, vérifiez:

1. **Row Level Security (RLS)**
   ```sql
   -- Activez RLS sur la table cars
   ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
   
   -- Policy pour lecture publique
   CREATE POLICY "Anyone can read cars" ON cars
     FOR SELECT TO anon USING (true);
   
   -- Policy pour l'admin
   CREATE POLICY "Admin can do everything" ON cars
     FOR ALL TO authenticated USING (true);
   ```

2. **API Keys**
   - Ne partagez JAMAIS votre `service_role` key
   - Utilisez seulement `anon` key dans le frontend
   - Gardez vos credentials dans des variables d'environnement

3. **Backup Réguliers**
   - Configurez des backups automatiques
   - Dashboard → Settings → Backups
   - Téléchargez un backup chaque semaine

---

## 🎉 C'EST FAIT!

Une fois la restauration terminée:

1. ✅ Testez votre site: `npm run dev`
2. ✅ Vérifiez que tout fonctionne
3. ✅ Configurez des backups automatiques
4. ✅ Notez vos nouvelles credentials

**Votre site Autoboss est de retour en ligne! 🚗💨**

---

*Guide créé le 1er février 2026*  
*Pour Autoboss Sénégal*
