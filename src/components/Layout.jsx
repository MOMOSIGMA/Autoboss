import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../config/supabase";
import Favorites from './Favorites';
import ContactForm from './ContactForm';
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

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState('Accueil');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des voitures', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        setCars(data);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/favorites') setCurrentPage('Favoris');
    else if (path === '/contact') setCurrentPage('Contact');
    else if (path === '/admin') setCurrentPage('Admin');
    else if (path === '/achat') setCurrentPage('Achat');
    else if (path === '/location') setCurrentPage('Location');
    else if (path.startsWith('/details')) setCurrentPage('Details');
    else setCurrentPage('Accueil');
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
      setMenuOpen(false);
      setCurrentPage('Accueil');
      toast.success('Recherche effectuée', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.error('Veuillez entrer un terme de recherche', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      handleSearch(e);
    }
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    if (page === 'Accueil') navigate('/');
    else if (page === 'Achat') navigate('/achat');
    else if (page === 'Location') navigate('/location');
    else if (page === 'Favoris') navigate('/favorites');
    else if (page === 'Admin') navigate('/admin');
    else if (page === 'Contact') navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 w-full bg-black text-white p-4 z-50 shadow-lg border-b border-gold">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-2xl text-gold" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <Link to="/">
              <img src="/logo.png" alt="Logo Autoboss" className="h-10" onClick={() => handleNavClick('Accueil')} />
            </Link>
          </div>
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Rechercher une voiture..."
                className="w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="off"
                aria-label="Rechercher une voiture"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </form>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <svg className="h-6 w-6 text-gold hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5V5.4c0-.96.78-1.74 1.74-1.74h2.53V0h-3.27c-3.1 0-5.5 2.4-5.5 5.5v2H7v3.5h3v9h3.5v-9h3.27l.5-3.5z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@marchenet_afrique?_t=ZM-8wiF81y7Oa5&_r=1" target="_blank" rel="noopener noreferrer">
              <svg className="h-6 w-6 text-gold hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6 4.8c-0.9-0.7-2-1.1-3.2-1.1-2.5 0-4.5 1.8-4.5 4v3h-2v3h2v7h3v-7h2.6l0.6-3h-3.2v-2c0-0.7 0.6-1.3 1.3-1.3 0.6 0 1.2 0.2 1.6 0.6l1.2-1.2z" />
              </svg>
            </a>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-black z-40 md:hidden border-b border-gold">
          <nav className="flex flex-col items-center py-4">
            <Link to="/contact" className="text-white py-2" onClick={() => handleNavClick('Contact')}>
              Contact
            </Link>
            <Link to="/admin" className="text-white py-2" onClick={() => handleNavClick('Admin')}>
              Admin
            </Link>
            <Link to="/favorites" className="text-white py-2" onClick={() => handleNavClick('Favoris')}>
              Favoris
            </Link>
            <Link to="/location" className="text-white py-2" onClick={() => handleNavClick('Location')}>
              Location
            </Link>
            <Link to="/achat" className="text-white py-2" onClick={() => handleNavClick('Achat')}>
              Achat
            </Link>
            <Link to="/" className="text-gold py-2" onClick={() => handleNavClick('Accueil')}>
              Accueil
            </Link>
          </nav>
        </div>
      )}
      <div className="flex pt-32">
        <aside className="hidden md:block w-64 bg-black p-4 h-screen fixed border-r border-gold">
          <nav>
            <ul>
              <li className="mb-2"><Link to="/" className="text-gold hover:underline" onClick={() => handleNavClick('Accueil')}>Accueil</Link></li>
              <li className="mb-2"><Link to="/achat" className="text-white hover:text-gold" onClick={() => handleNavClick('Achat')}>Achat</Link></li>
              <li className="mb-2"><Link to="/location" className="text-white hover:text-gold" onClick={() => handleNavClick('Location')}>Location</Link></li>
              <li className="mb-2"><Link to="/favorites" className="text-white hover:text-gold" onClick={() => handleNavClick('Favoris')}>Favoris</Link></li>
              <li className="mb-2"><Link to="/admin" className="text-white hover:text-gold" onClick={() => handleNavClick('Admin')}>Admin</Link></li>
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