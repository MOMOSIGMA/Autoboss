import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { Link } from 'react-router-dom';

function Footer() {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoadingPartners(true);
      const { data, error } = await supabase.from('partners').select('*');
      if (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
      } else {
        setPartners(data || []);
      }
      setLoadingPartners(false);
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const updateArrows = () => {
      const ref = scrollRef.current;
      if (ref) {
        const { scrollLeft, scrollWidth, clientWidth } = ref;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const handleScrollEvent = () => {
      updateArrows();
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScrollEvent);
    }

    updateArrows();

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScrollEvent);
      }
    };
  }, [partners]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white p-4 border-t border-yellow-400">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold text-yellow-400 mb-3 text-center">Nos Partenaires</h2>
        {loadingPartners ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-4 justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0 animate-pulse">
                <div className="w-12 h-12 bg-gray-700 rounded-full mb-2"></div>
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : partners.length === 0 ? (
          <p className="text-gray-400 text-center">Aucun partenaire pour le moment.</p>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 justify-center"
              style={{ scrollBehavior: 'smooth' }}
            >
              {partners.map((partner) => (
                <div key={partner.id} className="flex flex-col items-center flex-shrink-0">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="w-12 h-12 object-contain rounded-full mb-2"
                    loading="lazy"
                  />
                  <p className="text-white text-center text-sm">{partner.name}</p>
                </div>
              ))}
            </div>
            {showLeftArrow && (
              <button
                onClick={handleScrollLeft}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                aria-label="Défiler vers la gauche"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {showRightArrow && (
              <button
                onClick={handleScrollRight}
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
        <div className="text-center mt-4">
          <p>
            Contactez-nous :{' '}
            <a href="https://wa.me/+221762641751" className="text-yellow-400 underline hover:text-yellow-500">
              +221 76 264 17 51
            </a>{' '}
            |{' '}
            <Link to="/terms-of-use" className="text-yellow-400 underline hover:text-yellow-500">
              Conditions d'Utilisation
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  );
}

export default Footer;