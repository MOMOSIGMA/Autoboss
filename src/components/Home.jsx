import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import { toast } from 'react-toastify';
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

function Home({ cars }) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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
  const [showScroll, setShowScroll] = useState(false);
  const [viewedCars, setViewedCars] = useState(() => {
    const savedViewed = localStorage.getItem('viewedCars');
    return savedViewed ? JSON.parse(savedViewed) : [];
  });
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const search = params.get('q') || '';
  const carsPerPage = 12;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    'https://images.pexels.com/photos/18886584/pexels-photo-18886584/free-photo-of-la-vue-arriere-de-la-kia-ev5-garee-a-l-exterieur-par-une-journee-ensoleillee.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8664336/pexels-photo-8664336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ];

  useEffect(() => {
    if (cars.length > 0) {
      setLoading(false);
    } else {
      console.log('Aucune voiture chargée:', cars);
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
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

  useEffect(() => {
    if (search.trim()) {
      console.log('Redirection vers la page de recherche pour:', search);
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  }, [search, navigate]);

  const featuredCars = cars.filter(car => car.isFeatured);
  const promotedCars = cars.filter(car => car.promotion);
  const paginatedCars = cars.slice(0, page * carsPerPage);
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
      <Link to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`} className="block group">
        <div className="relative backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 h-full min-h-[20rem]">
          <div className="relative h-48 overflow-hidden">
            <img
              src={transformCloudinaryUrl(car.medias?.[0])}
              alt={`${car.marque} ${car.modele}`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
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
          <div className="p-2 flex-1">
            <div className="font-bold text-xl text-white mb-1">{car.marque} {car.modele}</div>
            <div className="text-sm text-gray-300">{car.annee} • {car.ville}</div>
            <div className="text-sm text-gray-300">{car.carburant} • {car.boite}</div>
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = () => (
    <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg animate-pulse h-full min-h-[20rem]">
      <div className="w-full h-48 bg-gray-600 rounded-lg"></div>
      <div className="p-2">
        <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 pt-16 relative bg-gray-900 min-h-screen text-white">
      <Helmet>
        <title>Autoboss - Voitures à Vendre et à Louer au Sénégal</title>
        <meta name="description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta name="keywords" content="voitures Sénégal, vendre voiture Dakar, louer voiture, Autoboss, voitures d'occasion" />
        <meta property="og:title" content="Autoboss - Voitures à Vendre et à Louer au Sénégal" />
        <meta property="og:description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <section className="relative h-[60vh] mb-12 bg-gray-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-[url(${img})] bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${img})` }}
            >
              <img src={img} alt={`Voiture ${index + 1}`} className="w-full h-full object-cover opacity-0" loading="lazy" />
            </div>
          ))}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-up">
              Conduisez l'Avenir
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 animate-fade-in-up delay-200">
              Trouvez la voiture de vos rêves au Sénégal
            </p>
          </div>
        </div>
      </section>

      <Filters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-center py-8 animate-pulse text-2xl text-yellow-400">Chargement…</div>
      ) : (
        <>
          <section className="mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Voitures en Vedette</h2>
            {featuredCars.length === 0 ? (
              <p className="text-gray-400">Aucune voiture en vedette pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featuredCars.slice(0, 3).map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>

          <section className="mb-12 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Nos Offres de la Semaine</h2>
            {promotedCars.length === 0 ? (
              <p className="text-gray-400">Aucune offre pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {promotedCars.slice(0, 6).map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>

          <section className="animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Toutes les Voitures</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {paginatedCars.length > 0 ? (
                paginatedCars.map(car => <CarCard key={car.id} car={car} />)
              ) : (
                Array.from({ length: carsPerPage }).map((_, index) => <SkeletonCard key={index} />)
              )}
            </div>
            {page * carsPerPage < cars.length && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full mx-auto block font-semibold hover:from-blue-600 transition-all duration-300"
              >
                Voir plus
              </button>
            )}
          </section>
        </>
      )}

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all duration-200 animate-bounce"
          title="Remonter en haut"
          aria-label="Retour en haut de la page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Home;