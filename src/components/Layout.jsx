import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Favorites from './Favorites';
import ContactForm from './ContactForm';
import Navbar from './Navbar';
import TermsOfUse from './TermsOfUse';
import { toast } from 'react-toastify';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function Achat({ cars }) {
  const filteredCars = cars?.filter(car => car.type === 'Achat') || [];
  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Vendre</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à vendre pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`} key={car.id} className="block group">
              <div className="bg-white text-black p-2 rounded-xl border border-gold shadow hover:shadow-2xl transition relative">
                <img src={car.medias?.[0]} alt={`${car.marque} ${car.modele}`} className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition" loading="lazy" />
                <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-xs font-bold shadow">{formatPrice(car.prix)}</div>
                {car.status === 'acheté' && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    Déjà Vendu
                  </div>
                )}
                <div className="p-1">
                  <div className="font-bold text-base">{car.marque} {car.modele}</div>
                  <div className="text-xs text-gray-500">{car.annee} • {car.ville}</div>
                  <div className="text-xs text-gray-500">{car.carburant} • {car.boite}</div>
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
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Louer</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à louer pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`} key={car.id} className="block group">
              <div className="bg-white text-black p-2 rounded-xl border border-gold shadow hover:shadow-2xl transition relative">
                <img src={car.medias?.[0]} alt={`${car.marque} ${car.modele}`} className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition" loading="lazy" />
                <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-xs font-bold shadow">{formatPrice(car.prix)}</div>
                {car.status === 'acheté' && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    Déjà Vendu
                  </div>
                )}
                <div className="p-1">
                  <div className="font-bold text-base">{car.marque} {car.modele}</div>
                  <div className="text-xs text-gray-500">{car.annee} • {car.ville}</div>
                  <div className="text-xs text-gray-500">{car.carburant} • {car.boite}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Contact() {
  return <ContactForm />;
}

function Layout({ cars, user, handleSignOut }) {
  const [currentPage, setCurrentPage] = useState('Accueil');
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Layout user state updated');
    }
    const path = location.pathname;
    if (path === '/favorites') setCurrentPage('Favoris');
    else if (path === '/contact') setCurrentPage('Contact');
    else if (path === '/achat') setCurrentPage('Achat');
    else if (path === '/location') setCurrentPage('Location');
    else if (path === '/blog') setCurrentPage('Blog');
    else if (path.startsWith('/blog/')) setCurrentPage('Blog');
    else if (path.startsWith('/voiture')) setCurrentPage('Details');
    else if (path === '/terms-of-use') setCurrentPage('Conditions');
    else if (path === '/signup') setCurrentPage('Inscription');
    else if (path === '/login') setCurrentPage('Connexion');
    else setCurrentPage('Accueil');
  }, [location, user]);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setShowInstallBanner(false);
      return;
    }

    const installed = localStorage.getItem('appInstalled');
    if (installed) {
      setShowInstallBanner(false);
      return;
    }

    const bannerClosed = localStorage.getItem('installBannerClosed');
    if (bannerClosed) {
      const closedTime = new Date(parseInt(bannerClosed));
      const now = new Date();
      const hoursSinceClosed = (now - closedTime) / (1000 * 60 * 60);
      if (hoursSinceClosed < 24) {
        setShowInstallBanner(false);
        return;
      }
    }

    setShowInstallBanner(true);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!installed && !bannerClosed) setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    if (page === 'Accueil') navigate('/');
    else if (page === 'Achat') navigate('/achat');
    else if (page === 'Location') navigate('/location');
    else if (page === 'Blog') navigate('/blog');
    else if (page === 'Favoris') navigate('/favorites');
    else if (page === 'Contact') navigate('/contact');
    else if (page === 'Conditions') navigate('/terms-of-use');
    else if (page === 'Inscription') navigate('/signup');
    else if (page === 'Connexion') navigate('/login');
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setShowInstallBanner(false);
          localStorage.setItem('appInstalled', 'true');
          toast.success('Application installée avec succès !');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleCloseBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerClosed', Date.now().toString());
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {showInstallBanner && (
        <div className="fixed top-0 left-0 right-0 bg-gold text-black p-3 flex justify-between items-center z-50 shadow-lg">
          <div className="flex items-center space-x-2">
            <button onClick={handleCloseBanner} className="text-black font-bold text-lg focus:outline-none hover:text-gray-700 transition">
              ✕
            </button>
            <p className="text-sm md:text-base">Installez Autoboss pour une navigation plus rapide et une expérience améliorée !</p>
          </div>
          <button onClick={handleInstallClick} className="bg-black text-gold px-4 py-1 rounded-lg hover:bg-gray-800 transition text-sm md:text-base">
            Installer l'application
          </button>
        </div>
      )}
      <Navbar currentPage={currentPage} handleNavClick={handleNavClick} user={user} handleSignOut={handleSignOut} />
      <div className="pt-16" style={{ marginTop: showInstallBanner ? '3rem' : '0' }}>
        <main className="w-full">
          {currentPage === 'Achat' ? <Achat cars={cars} /> : currentPage === 'Location' ? <Location cars={cars} /> : currentPage === 'Favoris' ? <Favorites /> : currentPage === 'Contact' ? <Contact /> : currentPage === 'Conditions' ? <TermsOfUse /> : <Outlet />}
        </main>
      </div>
      <footer className="bg-black text-white p-4 text-center border-t border-gold">
        <p>
          Contactez-nous : <a href="https://wa.me/+221762641751" className="text-gold underline hover:text-yellow-400">+221 76 264 17 51</a> |{' '}
          <Link to="/terms-of-use" className="text-gold underline hover:text-yellow-400">Conditions d'Utilisation</Link>
        </p>
      </footer>
    </div>
  );
}

export default Layout;