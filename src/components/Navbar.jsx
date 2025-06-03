import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTiktok } from 'react-icons/fa'; // Importer les icônes

const Navbar = ({ currentPage, handleNavClick, user, handleSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    if (searchInput.trim()) {
      navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
      setIsOpen(false);
      handleNavClick('Accueil');
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    navigate('/');
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/achat', label: 'Achat' },
    { to: '/location', label: 'Location' },
    { to: '/blog', label: 'Blog' },
    { to: '/favorites', label: 'Favoris' },
    { to: '/contact', label: 'Contact' },
    { to: '/terms-of-use', label: 'Conditions' },
  ];

  const authLinks = !user
    ? [
        { to: '/signup', label: 'Inscription', onClick: () => handleNavClick('Inscription') },
        { to: '/login', label: 'Connexion', onClick: () => handleNavClick('Connexion') },
      ]
    : [{ label: 'Se déconnecter', onClick: handleSignOut }];

  return (
    <nav className="fixed top-0 w-full bg-black text-white p-4 z-50 shadow-lg border-b border-gold">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-2xl text-gold focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo Autoboss"
              className="h-10"
              onClick={() => handleNavClick('Accueil')}
            />
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              type="search"
              name="search"
              placeholder="Rechercher une voiture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-10 rounded bg-gray-800 text-white border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
              autoComplete="off"
              aria-label="Rechercher une voiture"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 cursor-pointer"
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </form>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => handleNavClick(label)}
                className={`text-white hover:text-gold transition-colors ${currentPage === label ? 'text-gold font-semibold' : ''}`}
              >
                {label}
              </Link>
            ))}
            {authLinks.map(({ to, label, onClick }) =>
              to ? (
                <Link
                  key={to}
                  to={to}
                  onClick={() => { onClick(); handleMenuItemClick(); }}
                  className="text-white hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => { onClick(); handleMenuItemClick(); }}
                  className="text-white hover:text-gold transition-colors"
                >
                  {label}
                </button>
              )
            )}
          </div>
          <div className="flex space-x-2 social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="h-6 w-6 text-gold hover:text-yellow-400 transition-colors" />
            </a>
            <a href="https://www.tiktok.com/@marchenet_afrique?_t=ZM-8wiFz1hy7Oa5&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="h-6 w-6 text-gold hover:text-yellow-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40" onClick={handleMenuItemClick}>
          <div
            ref={menuRef}
            className="flex flex-col space-y-2 mt-16 p-4 bg-black border-t border-gold"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gold py-2 hover:bg-gray-800 rounded transition-colors"
                onClick={() => { handleNavClick(label); handleMenuItemClick(); }}
              >
                {label}
              </Link>
            ))}
            {authLinks.map(({ to, label, onClick }) =>
              to ? (
                <Link
                  key={to}
                  to={to}
                  className="text-gold py-2 hover:bg-gray-800 rounded transition-colors"
                  onClick={() => { onClick(); handleMenuItemClick(); }}
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => { onClick(); handleMenuItemClick(); }}
                  className="text-gold py-2 hover:bg-gray-800 rounded transition-colors text-left"
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;