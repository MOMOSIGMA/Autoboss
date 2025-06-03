import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './config/supabase';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Home from './components/Home';
import CarDetail from './components/CarDetail';
import Admin from './components/Admin';
import Layout from './components/Layout';
import Partners from './components/Partners';
import Favorites from './components/Favorites';
import ContactForm from './components/ContactForm';
import TermsOfUse from './components/TermsOfUse';
import Signup from './components/Signup';
import Login from './components/Login';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import SearchResults from './components/SearchResults';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@smastrom/react-rating/style.css';

function Achat({ cars }) {
  const filteredCars = cars?.filter(car => car.type === 'Achat') || [];
  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">Voitures à Vendre</h2>
      {filteredCars.length === 0 ? (
        <p>Aucune voiture à vendre pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link
              to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`}
              key={car.id}
              className="block group"
            >
              <div className="relative backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                <img
                  src={car.medias?.[0] || '/default-car.jpg'}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                  {(car.prix || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                </div>
                {car.status === 'acheté' && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm w-fit">
                    Déjà Vendu
                  </span>
                )}
                <div className="p-2">
                  <div className="font-bold text-base mb-1">{car.marque} {car.modele}</div>
                  <div className="text-sm text-gray-300">{car.annee} • {car.ville}</div>
                  <div className="text-sm text-gray-300">{car.carburant} • {car.boite}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Location({ cars }) {
  const filteredCars = cars?.filter(car => car.type === 'Location') || [];
  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">Voitures à Louer</h2>
      {filteredCars.length === 0 ? (
        <p>Aucune voiture à louer pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link
              to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`}
              key={car.id}
              className="block group"
            >
              <div className="relative backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                <img
                  src={car.medias?.[0] || '/default-car.jpg'}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                  {(car.prix || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                </div>
                {car.status === 'acheté' && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm w-fit">
                    Déjà Vendu
                  </span>
                )}
                <div className="p-2">
                  <div className="font-bold text-base mb-1">{car.marque} {car.modele}</div>
                  <div className="text-sm text-gray-300">{car.annee} • {car.ville}</div>
                  <div className="text-sm text-gray-300">{car.carburant} • {car.boite}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SecretAdminAccess() {
  return <Navigate to="/admin" replace />;
}

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Erreur lors de la vérification de la session:', sessionError.message);
        } else {
          console.log('Session initiale vérifiée:', session?.user?.id || 'Aucun utilisateur');
          setUser(session?.user || null);
        }

        console.log('Chargement des voitures depuis Supabase...');
        const { data, error } = await supabase.from('cars').select('*');
        if (error) {
          console.error('Erreur Supabase lors du chargement des voitures:', error.message);
          toast.error('Erreur lors du chargement des voitures');
          setCars([]);
        } else {
          console.log('Voitures chargées avec succès:', data.length, 'voitures');
          setCars(data || []);
        }
      } catch (err) {
        console.error('Erreur inattendue lors de l\'initialisation:', err.message);
        toast.error('Une erreur inattendue est survenue');
        setCars([]);
      } finally {
        setLoading(false);
        console.log('Chargement terminé, état loading:', false);
      }
    };

    initializeApp();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Événement auth changé:', event, 'Utilisateur:', session?.user?.id || 'Aucun');
      setUser(session?.user || null);
    });

    const checkTermsAcceptance = () => {
      const accepted = localStorage.getItem('termsAccepted');
      console.log('Conditions acceptées dans localStorage:', accepted);
      if (!accepted) {
        console.log('Planification de l\'affichage du modal des conditions après 20 secondes');
        const timer = setTimeout(() => {
          setShowTermsModal(true);
          console.log('Modal des conditions affiché');
        }, 20000);
        return () => clearTimeout(timer);
      }
    };

    checkTermsAcceptance();

    const interval = setInterval(() => {
      if (!localStorage.getItem('termsAccepted') && !showTermsModal) {
        console.log('Réaffichage du modal des conditions après 20 secondes');
        setShowTermsModal(true);
      }
    }, 20000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Erreur lors de la vérification de la session:', sessionError?.message || 'Aucune session active');
        setUser(null);
        toast.info('Session invalide. Déconnexion locale effectuée.');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
        toast.error('Erreur lors de la déconnexion');
        setUser(null);
        toast.info('Déconnexion locale effectuée.');
      } else {
        setUser(null);
        toast.success('Déconnexion réussie !');
      }
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error.message);
      toast.error('Une erreur est survenue lors de la déconnexion');
      setUser(null);
      toast.info('Déconnexion locale effectuée.');
    }
  };

  if (loading) {
    console.log('Application en état de chargement');
    return <div className="text-white text-center mt-10">Chargement...</div>;
  }

  console.log('Rendu du contenu principal de l\'application, voitures:', cars.length);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>Autoboss - Voitures à Vendre et à Louer</title>
          <meta name="description" content="Achetez ou louez des voitures au Sénégal avec Autoboss. Trouvez des offres incroyables à Dakar et dans d'autres villes." />
          <meta name="keywords" content="voitures Sénégal, voitures à vendre, voitures à louer, Dakar, Autoboss, Toyota, Hyundai" />
          <meta property="og:title" content="Autoboss - Voitures à Vendre et à Louer" />
          <meta property="og:description" content="Achetez ou louez des voitures au Sénégal avec Autoboss. Trouvez des offres incroyables à Dakar et dans d'autres villes." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content="/logo.png" />
        </Helmet>
        <Routes>
          <Route element={<Layout cars={cars} user={user} handleSignOut={handleSignOut} />}>
            <Route path="/" element={<><Home cars={cars} /><Partners /></>} />
            <Route path="/search" element={<SearchResults cars={cars} />} />
            <Route path="/voiture/:slug/:id" element={<><CarDetail user={user} /><Partners /></>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/achat" element={<Achat cars={cars} />} />
            <Route path="/location" element={<Location cars={cars} />} />
            <Route path="/secret-admin-access" element={<SecretAdminAccess />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
        {showTermsModal && !localStorage.getItem('termsAccepted') && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Conditions d'Utilisation</h2>
              <p className="mb-4">Veuillez accepter les conditions d'utilisation pour continuer à utiliser le site :</p>
              <div className="mb-4">
                <Link
                  to="/terms-of-use"
                  onClick={() => setShowTermsModal(false)}
                  className="text-blue-500 underline"
                >
                  Lire les conditions d'utilisation
                </Link>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('termsAccepted', 'true');
                  setShowTermsModal(false);
                  toast.success('Conditions acceptées !');
                }}
                className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition-all"
              >
                Accepter
              </button>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;