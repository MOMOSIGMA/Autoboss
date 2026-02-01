// src/components/Filters.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MARQUES_MODELES = {
  Toyota: ["Corolla", "Yaris", "Hilux", "Land Cruiser", "Camry", "RAV4", "Avensis", "Prius", "Auris", "C-HR", "Supra", "Verso", "Aygo"],
  Peugeot: ["208", "308", "3008", "508", "2008", "206", "207", "405", "406", "Partner", "Expert", "Boxer"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Talisman", "Scenic", "Kangoo", "Laguna", "Duster", "Sandero"],
  Mercedes: ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "GLA", "GLC", "GLE", "GLS", "Sprinter", "Vito"],
  BMW: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "X1", "X3", "X5", "X6", "i3", "i8"],
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT"],
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "Touran", "Jetta", "Caddy", "Transporter", "Amarok"],
  Ford: ["Fiesta", "Focus", "Kuga", "EcoSport", "Mondeo", "Ranger", "Transit", "Mustang", "Explorer"],
  Nissan: ["Micra", "Qashqai", "Juke", "Navara", "X-Trail", "Note", "Almera", "Patrol", "Leaf"],
  Hyundai: ["i10", "i20", "i30", "Tucson", "Santa Fe", "Elantra", "Accent", "Kona", "Creta"],
  Kia: ["Picanto", "Rio", "Sportage", "Sorento", "Ceed", "Optima", "Soul", "Stonic"],
};
const MARQUES = Object.keys(MARQUES_MODELES);
const BOITES = ["Manuelle", "Automatique"];
const VILLES = [
  "Dakar", "Guédiawaye", "Pikine", "Rufisque", "Bargny", "Keur Massar", "Sébikotane", "Diamniadio", "Thiès", "Mbour", "Tivaouane", "Saint-Louis", "Louga", "Richard-Toll", "Dagana", "Podor", "Matam", "Kanel", "Bakel", "Tambacounda", "Kédougou", "Kolda", "Velingara", "Sédhiou", "Ziguinchor", "Bignona", "Oussouye", "Kaolack", "Nioro du Rip", "Guinguinéo", "Fatick", "Foundiougne", "Gossas", "Kaffrine", "Birkilane", "Malem Hodar", "Autre"
];
const CARBURANTS = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];
const CATEGORIES = ['SUV', 'Sport', 'Familiale', 'Camion', 'Berline', 'Coupé', 'Cabriolet'];

function Filters({ filters, setFilters }) {
  const [sousTypes, setSousTypes] = useState([]);
  const [modeles, setModeles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    handleTypeChange({ target: { value: filters.type } });
  }, [filters.type]);

  useEffect(() => {
    if (filters.marque && MARQUES_MODELES[filters.marque]) {
      setModeles(MARQUES_MODELES[filters.marque]);
    } else {
      setModeles([]);
    }
  }, [filters.marque]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let options = [];
    if (type === 'Achat') {
      options = ['Neuf', 'Occasion', 'Certifié'];
    } else if (type === 'Location') {
      options = ['Par jour', 'Par semaine', 'Par mois'];
    }
    setSousTypes(options);
    setFilters({ ...filters, type, sousType: '' });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    const defaultFilters = {
      type: '',
      sousType: '',
      marque: '',
      modele: '',
      boite: '',
      ville: '',
      carburant: '',
      prixMin: '',
      prixMax: '',
      category: '',
    };
    setFilters(defaultFilters);
    setSousTypes([]);
    setModeles([]);
    localStorage.setItem('filters', JSON.stringify(defaultFilters));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-yellow-400">Filtres</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-500 transition-all duration-200"
          >
            Appliquer
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all duration-200"
          >
            Réinitialiser
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <select name="type" value={filters.type || ''} onChange={handleTypeChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Type</option>
          <option value="Achat">Achat</option>
          <option value="Location">Location</option>
        </select>
        {filters.type && sousTypes.length > 0 && (
          <select name="sousType" value={filters.sousType || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
            <option value="">Sous-type</option>
            {sousTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}
        <select name="marque" value={filters.marque || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Marque</option>
          {MARQUES.map(marque => (
            <option key={marque} value={marque}>{marque}</option>
          ))}
        </select>
        {filters.marque && modeles.length > 0 && (
          <select name="modele" value={filters.modele || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
            <option value="">Modèle</option>
            {modeles.map(modele => (
              <option key={modele} value={modele}>{modele}</option>
            ))}
          </select>
        )}
        <select name="boite" value={filters.boite || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Boîte</option>
          {BOITES.map(boite => (
            <option key={boite} value={boite}>{boite}</option>
          ))}
        </select>
        <select name="ville" value={filters.ville || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Ville</option>
          {VILLES.map(ville => (
            <option key={ville} value={ville}>{ville}</option>
          ))}
        </select>
        <select name="carburant" value={filters.carburant || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Carburant</option>
          {CARBURANTS.map(carburant => (
            <option key={carburant} value={carburant}>{carburant}</option>
          ))}
        </select>
        <select name="category" value={filters.category || ''} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white w-full">
          <option value="">Catégorie</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input
          type="number"
          name="prixMin"
          value={filters.prixMin || ''}
          onChange={handleFilterChange}
          placeholder="Prix min (FCFA)"
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
        <input
          type="number"
          name="prixMax"
          value={filters.prixMax || ''}
          onChange={handleFilterChange}
          placeholder="Prix max (FCFA)"
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
      </div>
    </div>
  );
}

export default Filters;