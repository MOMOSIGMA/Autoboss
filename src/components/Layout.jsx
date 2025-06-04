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

const transformCloudinaryUrl = (url) => {
  if (url && url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
  }
  return url;
};

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
                  src={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                  {formatPrice(car.prix || 0)}
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
                  src={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                  {formatPrice(car.prix || 0)}
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

function Contact() {
  return <ContactForm />;
}

function Layout({ cars, user, handleSignOut }) {
  const [currentPage, setCurrentPage] = useState('Accueil');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Layout: Page actuelle:', location.pathname);
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
    else if (path === '/search') setCurrentPage('Recherche');
    else setCurrentPage('Accueil');
  }, [location]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navbar currentPage={currentPage} handleNavClick={handleNavClick} user={user} handleSignOut={handleSignOut} />
      <div className="pt-16">
        <main className="w-full">
          {currentPage === 'Achat' ? <Achat cars={cars} /> : currentPage === 'Location' ? <Location cars={cars} /> : currentPage === 'Favoris' ? <Favorites /> : currentPage === 'Contact' ? <Contact /> : currentPage === 'Conditions' ? <TermsOfUse /> : <Outlet />}
        </main>
      </div>
      <footer className="bg-gray-900 text-white p-4 text-center border-t border-yellow-400">
        <p>
          Contactez-nous : <a href="https://wa.me/+221762641751" className="text-yellow-400 underline hover:text-yellow-500">+221 76 264 17 51</a> |{' '}
          <Link to="/terms-of-use" className="text-yellow-400 underline hover:text-yellow-500">Conditions d'Utilisation</Link>
        </p>
      </footer>
    </div>
  );
}

export default Layout;