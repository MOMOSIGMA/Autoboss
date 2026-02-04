import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const transformCloudinaryUrl = (url) => {
  if (url && url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_300,h_200,c_fill,q_auto:low,f_webp/');
  }
  return url;
};

const CarCard = React.memo(({ car }) => {
  const [viewedCars, setViewedCars] = useState(() => {
    const savedViewed = localStorage.getItem('viewedCars');
    return savedViewed ? JSON.parse(savedViewed) : [];
  });

  useEffect(() => {
    if (!viewedCars.includes(car.id)) {
      const updatedViewed = [...viewedCars, car.id];
      setViewedCars(updatedViewed);
      localStorage.setItem('viewedCars', JSON.stringify(updatedViewed));
    }
  }, [car.id, viewedCars]);

  return (
    <Link
      to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}/${car.id}`}
      className="block group"
    >
      <div className="relative backdrop-blur-md bg-white/10 p-2 rounded-lg border border-gray-500/30 shadow-md transition-all duration-200 w-full h-[11rem] hover:shadow-lg hover:border-yellow-400/50">
        <div className="relative h-24 overflow-hidden rounded-md mb-1">
          <img
            src={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'}
            alt={`${car.marque} ${car.modele}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-1 left-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
            {(car.prix / 1000000).toFixed(1)}M
          </div>
          {car.status === 'acheté' && (
            <span className="absolute bottom-1 right-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
              Déjà Vendu
            </span>
          )}
          {car.promotion && (
            <span className="absolute bottom-1 left-1 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
              {car.promotion.label}
            </span>
          )}
        </div>
        <div className="px-1">
          <div className="font-semibold text-sm text-white truncate leading-tight">{car.marque} {car.modele}</div>
          <div className="text-[10px] text-gray-300 truncate">{car.annee} • {car.ville}</div>
          <div className="text-[10px] text-gray-400 truncate">{car.carburant[0]} • {car.boite[0]}</div>
        </div>
      </div>
    </Link>
  );
});

const SkeletonCard = () => (
  <div className="backdrop-blur-md bg-white/10 p-2 rounded-lg border border-gray-500/30 shadow-md animate-pulse w-full h-[11rem]">
    <div className="w-full h-24 bg-gray-600 rounded-md mb-1"></div>
    <div className="px-1">
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
      <div className="h-3 bg-gray-600 rounded w-1/2 mb-0.5"></div>
      <div className="h-2 bg-gray-600 rounded w-1/3"></div>
    </div>
  </div>
);

function Home({ cars }) {
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
      category: '',
    };
  });
  const [showScroll, setShowScroll] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRefs = useRef({ featured: null, promotions: null });
  const [showLeftArrows, setShowLeftArrows] = useState({ featured: false, promotions: false });
  const [showRightArrows, setShowRightArrows] = useState({ featured: false, promotions: false });

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = params.get('q') || '';

  const heroImages = [
    {
      url: 'https://images.pexels.com/photos/18886584/pexels-photo-18886584/free-photo-of-la-vue-arriere-de-la-kia-ev5-garee-a-l-exterieur-par-une-journee-ensoleillee.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Kia EV5 en extérieur'
    },
    {
      url: 'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Voiture rouge en mouvement'
    },
    {
      url: 'https://images.pexels.com/photos/8664336/pexels-photo-8664336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Voiture blanche sur route'
    },
  ];

  const applyFilters = (carList) => {
    return carList.filter(car => {
      const matchesType = filters.type ? car.type === filters.type : true;
      const matchesSousType = filters.sousType ? car.sousType === filters.sousType : true;
      const matchesMarque = filters.marque ? car.marque.toLowerCase().includes(filters.marque.toLowerCase()) : true;
      const matchesModele = filters.modele ? car.modele.toLowerCase().includes(filters.modele.toLowerCase()) : true;
      const matchesBoite = filters.boite ? car.boite === filters.boite : true;
      const matchesVille = filters.ville ? car.ville.toLowerCase().includes(filters.ville.toLowerCase()) : true;
      const matchesCarburant = filters.carburant ? car.carburant === filters.carburant : true;
      const matchesPrixMin = filters.prixMin ? car.prix >= parseInt(filters.prixMin) : true;
      const matchesPrixMax = filters.prixMax ? car.prix <= parseInt(filters.prixMax) : true;
      const matchesCategory = filters.category ? car.category === filters.category : true;

      return matchesType && matchesSousType && matchesMarque && matchesModele && matchesBoite && matchesVille && matchesCarburant && matchesPrixMin && matchesPrixMax && matchesCategory;
    });
  };

  useEffect(() => {
    if (cars.length > 0) {
      setLoading(false);
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
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
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  }, [search, navigate]);

  useEffect(() => {
    const updateArrows = () => {
      const sections = ['featured', 'promotions'];
      const newLeftArrows = {};
      const newRightArrows = {};
      sections.forEach((section) => {
        const ref = scrollRefs.current[section];
        if (ref) {
          const { scrollLeft, scrollWidth, clientWidth } = ref;
          newLeftArrows[section] = scrollLeft > 0;
          newRightArrows[section] = scrollLeft < scrollWidth - clientWidth - 1;
        }
      });
      setShowLeftArrows(newLeftArrows);
      setShowRightArrows(newRightArrows);
    };

    const handleScrollEvent = () => {
      updateArrows();
    };

    Object.values(scrollRefs.current).forEach((ref) => {
      if (ref) {
        ref.addEventListener('scroll', handleScrollEvent);
      }
    });

    updateArrows();

    return () => {
      Object.values(scrollRefs.current).forEach((ref) => {
        if (ref) {
          ref.removeEventListener('scroll', handleScrollEvent);
        }
      });
    };
  }, [cars]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleScrollLeft = (section) => {
    const ref = scrollRefs.current[section];
    if (ref) {
      ref.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = (section) => {
    const ref = scrollRefs.current[section];
    if (ref) {
      ref.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const filteredCars = applyFilters(cars);
  const featuredCars = applyFilters(cars.filter(car => car.isFeatured));
  const promotionCars = applyFilters(cars.filter(car => car.promotion));

  return (
    <div className="container mx-auto p-4 pt-16 relative bg-gray-900 text-white min-h-screen" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <Helmet>
        <title>Autoboss - Voitures à Vendre et à Louer au Sénégal</title>
        <meta name="description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta name="keywords" content="voitures Sénégal, vendre voiture Dakar, louer voiture, Autoboss, voitures d'occasion" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:title" content="Autoboss - Voitures à Vendre et à Louer au Sénégal" />
        <meta property="og:description" content="Découvrez les meilleures voitures à vendre et à louer au Sénégal sur Autoboss. Filtres avancés, offres exclusives, et contact direct avec les vendeurs." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content={window.location.href} />
        {heroImages.map((image, index) => (
          <link key={index} rel="preload" href={image.url} as="image" />
        ))}
        {filteredCars.slice(0, 10).map((car, index) => (
          <link key={index} rel="preload" href={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'} as="image" />
        ))}
      </Helmet>

      <section className="relative h-[20vh] mb-4 bg-gray-900 rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${image.url})` }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover opacity-0"
                loading="lazy"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2">Conduisez l'Avenir</h1>
            <p className="text-sm md:text-base text-gray-300">Trouvez la voiture de vos rêves au Sénégal</p>
          </div>
        </div>
      </section>

      <Filters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-center py-8 animate-pulse text-xl text-yellow-400">Chargement…</div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Voitures en Vedette</h2>
            {featuredCars.length === 0 ? (
              <p className="text-gray-400">Aucune voiture en vedette pour le moment.</p>
            ) : (
              <div className="relative">
                <div
                  ref={(el) => (scrollRefs.current.featured = el)}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {featuredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                {showLeftArrows.featured && (
                  <button
                    onClick={() => handleScrollLeft('featured')}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                    aria-label="Défiler vers la gauche"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {showRightArrows.featured && (
                  <button
                    onClick={() => handleScrollRight('featured')}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                    aria-label="Défiler vers la droite"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Nos Offres de la Semaine</h2>
            {promotionCars.length === 0 ? (
              <p className="text-gray-400">Aucune offre pour le moment.</p>
            ) : (
              <div className="relative">
                <div
                  ref={(el) => (scrollRefs.current.promotions = el)}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {promotionCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                {showLeftArrows.promotions && (
                  <button
                    onClick={() => handleScrollLeft('promotions')}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                    aria-label="Défiler vers la gauche"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {showRightArrows.promotions && (
                  <button
                    onClick={() => handleScrollRight('promotions')}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                    aria-label="Défiler vers la droite"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Toutes les Voitures</h2>
            {filteredCars.length === 0 ? (
              <p className="text-gray-400">Aucune voiture disponible avec ces filtres.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-all duration-200"
          title="Remonter en haut"
          aria-label="Retour en haut de la page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;