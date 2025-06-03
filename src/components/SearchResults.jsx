import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Filters from './Filters';
import { Helmet } from 'react-helmet-async';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const transformCloudinaryUrl = (url) => {
  if (url && url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
  }
  return url;
};

function SearchResults({ cars }) {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : {
      type: '',
      sousType: '',
      marque: '',
      modele: '',
      boite: '',
      ville: '',
      carburant: '',
      prixMin: '',
      prixMax: '',
    };
  });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get('q') || '';

  useEffect(() => {
    if (cars && cars.length >= 0) {
      setLoading(false);
    }
  }, [cars]);

  useEffect(() => {
    const newFilters = {
      type: params.get('type') || '',
      sousType: params.get('sousType') || '',
      marque: params.get('marque') || '',
      modele: params.get('modele') || '',
      boite: params.get('boite') || '',
      ville: params.get('ville') || '',
      carburant: params.get('carburant') || '',
      prixMin: params.get('prixMin') || '',
      prixMax: params.get('prixMax') || '',
    };
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters));
  }, [location.search]);

  const filteredCars = cars.filter(car => {
    const marqueModele = `${car.marque} ${car.modele}`.toLowerCase();
    const searchLower = search.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/);
    const matchSearch = !searchLower || (
      marqueModele.includes(searchLower) ||
      searchTerms.every(term =>
        marqueModele.includes(term) ||
        car.marque?.toLowerCase().includes(term) ||
        car.modele?.toLowerCase().includes(term) ||
        car.ville?.toLowerCase().includes(term) ||
        car.annee?.toString().includes(term) ||
        car.boite?.toLowerCase().includes(term) ||
        car.carburant?.toLowerCase().includes(term)
      )
    );

    const matchFilters =
      (filters.type === '' || car.type === filters.type) &&
      (filters.sousType === '' || car.sousType === filters.sousType) &&
      (filters.marque === '' || car.marque === filters.marque) &&
      (filters.modele === '' || car.modele === filters.modele) &&
      (filters.boite === '' || car.boite === filters.boite) &&
      (filters.ville === '' || car.ville === filters.ville) &&
      (filters.carburant === '' || car.carburant === filters.carburant) &&
      (filters.prixMin === '' || car.prix >= parseInt(filters.prixMin || 0)) &&
      (filters.prixMax === '' || car.prixMax || car.prix <= parseInt(filters.prixMax || Infinity));

    // Log conditionnel pour débogage en développement
    if (process.env.NODE_ENV !== 'production' && !matchSearch) {
      console.log('Voiture non incluse dans la recherche:', car.id, 'Marque+Modèle:', marqueModele, 'Search:', searchLower);
    }
    return matchSearch && matchFilters;
  });

  // Log minimal pour vérifier le nombre de résultats
  if (process.env.NODE_ENV !== 'production') {
    console.log('Voitures filtrées:', filteredCars.length, 'pour recherche:', search);
  }

  const CarCard = ({ car }) => (
    <Link
      to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`}
      className="block group"
    >
      <div className="relative backdrop-blur-md bg-white/10 p-3 rounded-xl border border-yellow-400/30 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
        <div className="relative h-36 overflow-hidden">
          <img
            src={transformCloudinaryUrl(car.medias?.[0])}
            alt={`${car.marque} ${car.modele}`}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
            {formatPrice(car.prix)}
          </div>
          <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            {car.status === 'acheté' && (
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow w-fit">
                Déjà Vendu
              </span>
            )}
            {car.promotion && (
              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold shadow w-fit">
                {car.promotion.label}
              </span>
            )}
          </div>
        </div>
        <div className="p-2">
          <div className="font-bold text-base text-white mb-1">{car.marque} {car.modele}</div>
          <div className="text-xs text-gray-300">{car.annee} • {car.ville}</div>
          <div className="text-xs text-gray-300">{car.carburant} • {car.boite}</div>
        </div>
      </div>
    </Link>
  );

  const SkeletonCard = () => (
    <div className="backdrop-blur-md bg-white/10 p-3 rounded-xl border border-yellow-400/30 shadow-lg animate-pulse h-full">
      <div className="w-full h-36 bg-gray-600 rounded-lg"></div>
      <div className="p-2">
        <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 pt-16 relative bg-gray-900 min-h-screen text-white">
      <Helmet>
        <title>Autoboss - Résultats de Recherche</title>
        <meta name="description" content={`Résultats de recherche pour "${search || 'tous les filtres'}" sur Autoboss. Trouvez des voitures à vendre ou à louer au Sénégal.`} />
        <meta name="keywords" content="voitures Sénégal, recherche voiture, Autoboss, voitures d'occasion" />
      </Helmet>

      <Filters filters={filters} setFilters={setFilters} />

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Résultats pour "{search || 'Tous les filtres'}"
        </h2>
        {loading ? (
          <div className="text-center py-8 animate-pulse text-2xl text-yellow-400">Chargement…</div>
        ) : filteredCars.length === 0 ? (
          <p className="text-gray-400">Aucune voiture disponible pour votre recherche.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchResults;