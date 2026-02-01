-- ✅ CRÉER LES TABLES - AUTOBOSS
-- Exécutez ce script dans SQL Editor de votre nouveau projet Supabase

-- 1️⃣ TABLE CARS (Voitures)
CREATE TABLE public.cars (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    marque text NOT NULL,
    modele text NOT NULL,
    annee integer,
    type text NOT NULL,
    "sousType" text,
    ville text,
    carburant text,
    boite text,
    prix integer NOT NULL,
    provenance text,
    description text,
    "sellerNumber" text,
    status text DEFAULT 'disponible',
    medias text[] DEFAULT '{}',
    "mediasToRemove" jsonb DEFAULT '[]',
    "isFeatured" boolean DEFAULT false,
    promotion jsonb,
    category text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Index pour la performance
CREATE INDEX idx_cars_type ON public.cars(type);
CREATE INDEX idx_cars_ville ON public.cars(ville);
CREATE INDEX idx_cars_marque ON public.cars(marque);
CREATE INDEX idx_cars_status ON public.cars(status);

-- 2️⃣ TABLE CONTACTS
CREATE TABLE public.contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    contact text NOT NULL,
    notifications boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ TABLE PARTNERS
CREATE TABLE public.partners (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    logo text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ TABLE PROFILES (pour les utilisateurs)
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
    username text NOT NULL,
    full_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- 4️⃣ TABLE USERS (Rôles et permissions)
CREATE TABLE public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
    email text NOT NULL UNIQUE,
    role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at timestamp with time zone DEFAULT now()
);

-- 5️⃣ TABLE REQUESTS (Demandes)
CREATE TABLE public.requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    contact text NOT NULL,
    car_type text,
    marque text,
    modele text,
    budget integer,
    details text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 6️⃣ TABLE REVIEWS (Avis sur les voitures)
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_reviews_car_id ON public.reviews(car_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- 7️⃣ VIEW REVIEWS_WITH_USER (Vue pour afficher les avis avec les noms d'utilisateurs)
CREATE OR REPLACE VIEW public.reviews_with_user AS
SELECT 
    r.id,
    r.car_id,
    r.rating,
    r.comment,
    r.created_at,
    COALESCE(p.full_name, u.email) as full_name
FROM public.reviews r
LEFT JOIN public.profiles p ON r.user_id = p.id
LEFT JOIN auth.users u ON r.user_id = u.id;

-- ✅ ROW LEVEL SECURITY (RLS)

-- CARS: Tout le monde peut lire, seulement authentifiés peuvent modifier
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cars" ON public.cars
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert cars" ON public.cars
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update cars" ON public.cars
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete cars" ON public.cars
    FOR DELETE TO authenticated USING (true);

-- CONTACTS: Tout le monde peut créer
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- PARTNERS: Tout le monde peut lire
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read partners" ON public.partners
    FOR SELECT TO anon, authenticated USING (true);

-- REQUESTS: Tout le monde peut créer
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert requests" ON public.requests
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- PROFILES: Seulement son propre profil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- USERS: Seulement les admins peuvent voir et modifier
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Only admins can update users" ON public.users
    FOR UPDATE USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- REVIEWS: Tout le monde peut lire, authentifiés peuvent créer
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert reviews" ON public.reviews
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- ✅ C'EST TOUT!
-- Votre base de données est prête
-- Les tables sont vides et prêtes à accueillir de nouvelles données
