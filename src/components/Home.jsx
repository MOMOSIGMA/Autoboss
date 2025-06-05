// src/components/Home.jsx
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
    return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
  }
  return url;
};

const CarCard = React.memo(({ car, animateOnce }) => {
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
      <div className={`relative backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg transition-all duration-300 h-[18rem] w-[16rem] min-h-[18rem] ${animateOnce ? 'animate-fade-in-up' : ''}`}>
        <div className="relative h-48 overflow-hidden rounded-lg">
          <img
            src={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'}
            alt={`${car.marque} ${car.modele}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
            {formatPrice(car.prix || 0)}
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
});

const SkeletonCard = () => (
  <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-gray-500/30 shadow-lg animate-pulse h-[18rem] w-[16rem] min-h-[18rem]">
    <div className="w-full h-48 bg-gray-600 rounded-lg"></div>
    <div className="p-2">
      <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-600 rounded w-1/3"></div>
    </div>
  </div>
);

function Home({ cars }) {
  const [loading, setLoading] = useState(true);
  const [visibleCarsCount, setVisibleCarsCount] = useState(16);
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
  const scrollRefs = useRef([]);
  const [showLeftArrows, setShowLeftArrows] = useState([]);
  const [showRightArrows, setShowRightArrows] = useState([]);
  const [animateOnce, setAnimateOnce] = useState(() => {
    const sessionAnimated = sessionStorage.getItem('homeCardsAnimated');
    if (!sessionAnimated) {
      sessionStorage.setItem('homeCardsAnimated', 'true'); // Marque immédiatement
    }
    return !sessionAnimated;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = params.get('q') || '';
  const carsPerRow = 4;
  const rowsToShow = Math.ceil(visibleCarsCount / carsPerRow);

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

  // Fonction pour appliquer les filtres
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
      const leftArrows = [];
      const rightArrows = [];
      scrollRefs.current.forEach((ref, index) => {
        if (ref) {
          const { scrollLeft, scrollWidth, clientWidth } = ref;
          leftArrows[index] = scrollLeft > 0;
          rightArrows[index] = scrollLeft < scrollWidth - clientWidth - 1;
        }
      });
      setShowLeftArrows(leftArrows);
      setShowRightArrows(rightArrows);
    };

    const handleScrollEvent = () => {
      updateArrows();
    };

    scrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.addEventListener('scroll', handleScrollEvent);
      }
    });

    updateArrows();

    return () => {
      scrollRefs.current.forEach((ref) => {
        if (ref) {
          ref.removeEventListener('scroll', handleScrollEvent);
        }
      });
    };
  }, [visibleCarsCount, cars]);

  useEffect(() => {
    const autoScroll = () => {
      scrollRefs.current.forEach((ref) => {
        if (ref) {
          const scrollAmount = 20;
          ref.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          setTimeout(() => {
            ref.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }, 1000);
        }
      });
    };

    const interval = setInterval(autoScroll, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const loadMoreCars = () => {
    setVisibleCarsCount((prev) => prev + 16);
  };

  const handleScrollLeft = (rowIndex) => {
    const ref = scrollRefs.current[rowIndex];
    if (ref) {
      ref.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = (rowIndex) => {
    const ref = scrollRefs.current[rowIndex];
    if (ref) {
      ref.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Appliquer les filtres aux voitures
  const filteredCars = applyFilters(cars);
  const visibleCars = filteredCars.slice(0, visibleCarsCount);
  const rows = [];
  for (let i = 0; i < visibleCars.length; i += carsPerRow) {
    rows.push(visibleCars.slice(i, i + carsPerRow));
  }

  return (
    <div className="container mx-auto p-4 pt-20 relative bg-gray-900 text-white min-h-screen" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
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
        {visibleCars.slice(0, 6).map((car, index) => (
          <link key={index} rel="preload" href={transformCloudinaryUrl(car.medias?.[0]) || '/default-car.jpg'} as="image" />
        ))}
      </Helmet>

      <section className="relative h-[60vh] mb-12 bg-gray-900 rounded-2xl overflow-hidden">
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
            {applyFilters(cars.filter(car => car.isFeatured)).length === 0 ? (
              <p className="text-gray-400">Aucune voiture en vedette pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {applyFilters(cars.filter(car => car.isFeatured)).map(car => (
                  <CarCard key={car.id} car={car} animateOnce={false} />
                ))}
              </div>
            )}
          </section>

          <section className="mb-12 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Nos Offres de la Semaine</h2>
            {applyFilters(cars.filter(car => car.promotion)).length === 0 ? (
              <p className="text-gray-400">Aucune offre pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {applyFilters(cars.filter(car => car.promotion)).map(car => (
                  <CarCard key={car.id} car={car} animateOnce={false} />
                ))}
              </div>
            )}
          </section>

          <section className="animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Toutes les Voitures</h2>
            {rows.length > 0 ? (
              <div className="space-y-6">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="relative">
                    <div
                      ref={(el) => (scrollRefs.current[rowIndex] = el)}
                      className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {row.map(car => (
                        <div key={car.id} className="snap-start flex-shrink-0">
                          <CarCard car={car} animateOnce={animateOnce} />
                        </div>
                      ))}
                    </div>
                    {showLeftArrows[rowIndex] && (
                      <button
                        onClick={() => handleScrollLeft(rowIndex)}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition md:hidden"
                        aria-label="Défiler vers la gauche"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {showRightArrows[rowIndex] && (
                      <button
                        onClick={() => handleScrollRight(rowIndex)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition md:hidden"
                        aria-label="Défiler vers la droite"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucune voiture disponible avec ces filtres.</p>
            )}
            {visibleCarsCount < filteredCars.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMoreCars}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-500 transition-all duration-200"
                >
                  Voir plus
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all duration-200"
          title="Remonter en haut"
          aria-label="Retour en haut de la page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <style jsx>{`
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