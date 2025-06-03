import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Filters from './Filters';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function Home({ cars }) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : {
      type: 'Achat',
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
  const [showScroll, setShowScroll] = useState(false);
  const [viewedCars, setViewedCars] = useState(() => {
    const savedViewed = localStorage.getItem('viewedCars');
    return savedViewed ? JSON.parse(savedViewed) : [];
  });
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const search = params.get('q') || '';
  const carsPerPage = 12;

  useEffect(() => {
    if (cars.length > 0) {
      setLoading(false);
    }
  }, [cars]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  const filteredCars = cars.filter(car => {
    const matchSearch = !search.trim() || [
      car.marque,
      car.modele,
      car.ville,
      car.annee,
      car.boite,
      car.carburant
    ].join(' ').toLowerCase().includes(search.toLowerCase());

    const matchFilters =
      (filters.type === '' || car.type === filters.type) &&
      (filters.sousType === '' || car.sousType === filters.sousType) &&
      (filters.marque === '' || car.marque === filters.marque) &&
      (filters.modele === '' || car.modele === filters.modele) &&
      (filters.boite === '' || car.boite === filters.boite) &&
      (filters.ville === '' || car.ville === filters.ville) &&
      (filters.carburant === '' || car.carburant === filters.carburant) &&
      (filters.prixMin === '' || car.prix >= parseInt(filters.prixMin || 0)) &&
      (filters.prixMax === '' || car.prix <= parseInt(filters.prixMax || Infinity));

    return matchSearch && matchFilters;
  });

  const featuredCars = filteredCars.filter(car => car.isFeatured);
  const promotedCars = filteredCars.filter(car => car.promotion);
  const paginatedCars = filteredCars.slice(0, page * carsPerPage);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const CarCard = ({ car }) => {
    useEffect(() => {
      if (!viewedCars.includes(car.id)) {
        const updatedViewed = [...viewedCars, car.id];
        setViewedCars(updatedViewed);
        localStorage.setItem('viewedCars', JSON.stringify(updatedViewed));
      }
    }, [car.id, viewedCars]);

    return (
      <Link to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`} key={car.id} className="block group">
        <div className="bg-white text-black p-2 rounded-xl border border-gold shadow hover:shadow-2xl transition relative h-full">
          <div className="relative">
            <img
              src={car.medias?.[0]}
              alt={`${car.marque} ${car.modele}`}
              className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-[0.7rem] sm:text-xs font-bold shadow">
              {formatPrice(car.prix)}
            </div>
            {car.status === 'acheté' && (
              <div className="absolute -top-3 left-0 bg-red-600 text-white px-2 py-1 rounded text-[0.7rem] font-bold shadow z-10">
                Déjà Vendu
              </div>
            )}
          </div>
          <div className="p-1 relative">
            <div className="font-bold text-base pt-2">{car.marque} {car.modele}</div>
            <div className="text-xs text-gray-500">{car.annee} • {car.ville}</div>
            <div className="text-xs text-gray-500">{car.carburant} • {car.boite}</div>
            {car.promotion && (
              <div className="mt-1 bg-yellow-400 text-black px-2 py-1 rounded text-[0.7rem] font-bold shadow">
                {car.promotion.label}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800 p-2 rounded-xl border border-gold shadow animate-pulse">
      <div className="w-full h-32 bg-gray-700 rounded-lg"></div>
      <div className="p-1">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 pt-4 relative">
      <Helmet>
        <title>Autoboss - Voitures à Vendre et à Louer au Sénégal</title>
        <meta name="description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta name="keywords" content="voitures Sénégal, vendre voiture Dakar, louer voiture, Autoboss, voitures d'occasion" />
        <meta property="og:title" content="Autoboss - Voitures à Vendre et à Louer au Sénégal" />
        <meta property="og:description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <Filters filters={filters} setFilters={setFilters} title="Trier & Filtrer" />

      {loading ? (
        <div className="text-white text-center py-8 animate-pulse-text">Chargement…</div>
      ) : (
        <>
          {search && (
            <section>
              <h2 className="text-xl font-bold text-gold mb-2">Résultats pour "{search}"</h2>
              {filteredCars.length === 0 ? (
                <p className="text-white">Aucun résultat.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {paginatedCars.map(car => <CarCard car={car} key={car.id} />)}
                </div>
              )}
            </section>
          )}

          {!search && (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gold mb-2">Voitures en Vedette</h2>
                {featuredCars.length === 0 ? (
                  <p className="text-white">Aucune voiture en vedette pour le moment.</p>
                ) : (
                  <div className="flex overflow-x-auto space-x-4 pb-2">
                    {featuredCars.slice(0, 5).map(car => (
                      <div key={car.id} className="min-w-[200px]">
                        <CarCard car={car} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-bold text-gold mb-2">Nos Offres de la Semaine</h2>
                {promotedCars.length === 0 ? (
                  <p className="text-white">Aucune offre pour le moment.</p>
                ) : (
                  <div className="flex overflow-x-auto space-x-4 pb-2">
                    {promotedCars.slice(0, 6).map(car => (
                      <div key={car.id} className="min-w-[200px]">
                        <CarCard car={car} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-bold text-gold mb-2">Toutes les Voitures</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {paginatedCars.length > 0 ? (
                    paginatedCars.map(car => <CarCard car={car} key={car.id} />)
                  ) : (
                    Array(carsPerPage).fill().map((_, index) => <SkeletonCard key={index} />)
                  )}
                </div>
                {page * carsPerPage < filteredCars.length && (
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="mt-4 bg-gold text-black px-4 py-2 rounded mx-auto block"
                  >
                    Voir plus
                  </button>
                )}
              </section>
            </>
          )}
        </>
      )}

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gold text-black rounded-full p-3 shadow-lg z-50 hover:bg-yellow-400 transition"
          title="Remonter en haut"
          aria-label="Remonter en haut de la page"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;