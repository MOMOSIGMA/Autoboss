import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Favorites from './Favorites';
import ContactForm from './ContactForm';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function Achat({ cars }) {
  const filteredCars = cars.filter(car => car.type === 'Achat');
  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Vendre</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à vendre pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/details/${car.id}`} key={car.id} className="block group">
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
  const filteredCars = cars.filter(car => car.type === 'Location');
  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Louer</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à louer pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/details/${car.id}`} key={car.id} className="block group">
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

function Layout({ cars }) { // Accepte cars comme prop
  const [currentPage, setCurrentPage] = useState('Accueil');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/favorites') setCurrentPage('Favoris');
    else if (path === '/contact') setCurrentPage('Contact');
    else if (path === '/achat') setCurrentPage('Achat');
    else if (path === '/location') setCurrentPage('Location');
    else if (path.startsWith('/details')) setCurrentPage('Details');
    else setCurrentPage('Accueil');
  }, [location]);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    if (page === 'Accueil') navigate('/');
    else if (page === 'Achat') navigate('/achat');
    else if (page === 'Location') navigate('/location');
    else if (page === 'Favoris') navigate('/favorites');
    else if (page === 'Contact') navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currentPage={currentPage} handleNavClick={handleNavClick} />
      <div className="flex pt-32">
        <aside className="hidden md:block w-64 bg-black p-4 h-screen fixed border-r border-gold">
          <nav>
            <ul>
              <li className="mb-2"><Link to="/" className="text-gold hover:underline" onClick={() => handleNavClick('Accueil')}>Accueil</Link></li>
              <li className="mb-2"><Link to="/achat" className="text-white hover:text-gold" onClick={() => handleNavClick('Achat')}>Achat</Link></li>
              <li className="mb-2"><Link to="/location" className="text-white hover:text-gold" onClick={() => handleNavClick('Location')}>Location</Link></li>
              <li className="mb-2"><Link to="/favorites" className="text-white hover:text-gold" onClick={() => handleNavClick('Favoris')}>Favoris</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white hover:text-gold" onClick={() => handleNavClick('Contact')}>Contact</Link></li>
            </ul>
          </nav>
        </aside>
        <main className="ml-0 md:ml-64 w-full">
          {currentPage === 'Achat' ? <Achat cars={cars} /> : currentPage === 'Location' ? <Location cars={cars} /> : currentPage === 'Favoris' ? <Favorites /> : currentPage === 'Contact' ? <Contact /> : <Outlet />}
        </main>
      </div>
      <footer className="bg-black text-white p-4 text-center border-t border-gold">
        <p>Contactez-nous : <a href="https://wa.me/+221762641751" className="text-gold underline hover:text-yellow-400">+221 76 264 17 51</a></p>
      </footer>
    </div>
  );
}

export default Layout;