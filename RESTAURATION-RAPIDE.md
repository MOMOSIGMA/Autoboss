# 🚀 SCRIPT DE RESTAURATION RAPIDE

## Étape par Étape (Copy-Paste)

### 1. Installer Supabase CLI
```powershell
npm install -g supabase
```

### 2. Login
```powershell
supabase login
```

### 3. Extraire le backup
```powershell
# Naviguez vers le dossier où est le backup
cd "C:\Users\mbath\AppData\Local\Temp\d8c1d534-9810-484d-9084-6dfd08c30abe_db_cluster-25-06-2025@13-23-24.backup (1).gz.abe"

# Si vous avez 7-Zip installé:
& "C:\Program Files\7-Zip\7z.exe" x "db_cluster-25-06-2025@13-23-24.backup (1).gz"

# Sinon, utilisez WinRAR ou extrayez manuellement
```

### 4. Connectez-vous à votre nouveau projet
```powershell
# Remplacez [PASSWORD] et [REF] par vos vraies valeurs
# Trouvez-les dans: Dashboard → Settings → Database → Connection string

$DB_URL = "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Si le backup est en .sql:
Get-Content "db_cluster-25-06-2025@13-23-24.backup.sql" | psql $DB_URL

# Si le backup est en format pg_dump:
pg_restore -d $DB_URL "db_cluster-25-06-2025@13-23-24.backup"
```

---

## 🎯 MÉTHODE SIMPLE (Sans CLI)

### 1. Créer nouveau projet Supabase
- https://supabase.com/dashboard → New Project
- Attendez 2 minutes

### 2. Extraire le fichier .gz
- Clic droit → Extraire avec 7-Zip/WinRAR
- Vous aurez un fichier .sql

### 3. Copier dans SQL Editor
- Dashboard → SQL Editor → New Query
- Ouvrez le .sql dans Notepad++
- Copiez tout (Ctrl+A, Ctrl+C)
- Collez dans SQL Editor (Ctrl+V)
- Run ▶

### 4. Mettre à jour les credentials
```javascript
// c:\Autoboss\src\config\supabase.js

const supabaseUrl = 'https://[NOUVEAU-REF].supabase.co'
const supabaseAnonKey = '[NOUVELLE-KEY]'
```

### 5. Tester
```powershell
cd c:\Autoboss
npm run dev
```

Ouvrez http://localhost:5173 → Vérifiez que les voitures s'affichent ✅

---

## ⚡ ENCORE PLUS SIMPLE

**Si votre projet n'est que en PAUSE (pas supprimé):**

1. Allez sur https://supabase.com/dashboard
2. Cliquez sur votre projet
3. Cliquez "Restore" ou "Unpause"
4. Attendez 30 secondes
5. ✅ Terminé! Tout est de retour!

Aucun backup à restaurer, tout est déjà là! 🎉
