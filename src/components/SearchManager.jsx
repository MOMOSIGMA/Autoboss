import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const SearchManager = ({ navigate, handleNavClick, setIsOpen }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cachedCars, setCachedCars] = useState([]);

  useEffect(() => {
    const fetchCarsForCache = async () => {
      const { data, error } = await supabase.from('cars').select('marque, modele, ville, annee, boite, carburant');
      if (error) {
        console.error('Erreur lors du cache des voitures:', error.message);
      } else {
        setCachedCars(data);
      }
    };
    fetchCarsForCache();
  }, []);

  useEffect(() => {
    if (search.trim() && cachedCars.length > 0) {
      const searchTerms = search.toLowerCase().trim().split(/\s+/);
      const filtered = cachedCars
        .filter(car => {
          const marqueModele = `${car.marque} ${car.modele}`.toLowerCase();
          return searchTerms.every(term =>
            marqueModele.includes(term) ||
            car.marque?.toLowerCase().includes(term) ||
            car.modele?.toLowerCase().includes(term) ||
            car.ville?.toLowerCase().includes(term) ||
            car.annee?.toString().includes(term) ||
            car.boite?.toLowerCase().includes(term) ||
            car.carburant?.toLowerCase().includes(term)
          );
        })
        .map(car => ({
          label: `${car.marque} ${car.modele}`,
          value: `${car.marque} ${car.modele}`
        }));
      const uniqueSuggestions = [...new Set(filtered.map(item => JSON.stringify(item)))].map(item => JSON.parse(item)).slice(0, 5);
      setSuggestions(uniqueSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search, cachedCars]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setIsOpen(false);
      handleNavClick('Recherche');
      setSuggestions([]);
      setSearch('');
    } else {
      navigate('/search');
    }
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSuggestions([]);
    setIsOpen(false);
    handleNavClick('Recherche');
  };

  const handleClearSearch = () => {
    setSearch('');
    setSuggestions([]);
    navigate('/search');
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4 relative">
      <div className="relative">
        <input
          type="search"
          name="q"
          placeholder="Rechercher une voiture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 rounded bg-gray-700 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          autoComplete="off"
          aria-label="Rechercher une voiture"
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2 top-2 text-white hover:text-gray-300 cursor-pointer"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-gray-800 border border-yellow-400 rounded mt-1 z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion.value)}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};

export default SearchManager;