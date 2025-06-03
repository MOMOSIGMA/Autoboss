// src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ handleNavClick, setIsOpenMenu }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      handleNavClick?.('Chercher');
      setIsOpenMenu?.(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="fixed top-[68px] left-0 w-full bg-gray-900 z-40 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <form onSubmit={handleSearch} className="w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une voiture..."
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            aria-label="Rechercher une voiture"
          />
        </form>
      </div>
    </div>
  );
}

export default SearchBar;