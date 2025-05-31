import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ currentPage, handleNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    if (searchInput.trim()) {
      navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
      setIsOpen(false);
      handleNavClick('Accueil');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white p-4 z-50 shadow-lg border-b border-gold">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-2xl text-gold" onClick={() => setIsOpen(!isOpen)}>☰</button>
          <Link to="/">
            <img src="/logo.png" alt="Logo Autoboss" className="h-10" onClick={() => handleNavClick('Accueil')} />
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              type="search"
              name="search"
              placeholder="Rechercher une voiture..."
              className="w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
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
      {isOpen && (
        <div className="md:hidden mobile-menu flex flex-col-reverse space-y-2 mt-2">
          <Link to="/contact" className="text-gold py-2" onClick={() => handleNavClick('Contact')}>Contact</Link>
          <Link to="/favorites" className="text-gold py-2" onClick={() => handleNavClick('Favoris')}>Favoris</Link>
          <Link to="/location" className="text-gold py-2" onClick={() => handleNavClick('Location')}>Location</Link>
          <Link to="/achat" className="text-gold py-2" onClick={() => handleNavClick('Achat')}>Achat</Link>
          <Link to="/" className="text-gold py-2" onClick={() => handleNavClick('Accueil')}>Accueil</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;