import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from "../config/supabase";
import { toast } from 'react-toastify';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [modalImg, setModalImg] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCar = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de la voiture:", error);
        toast.error('Erreur lors du chargement de la voiture');
        setLoading(false);
        return;
      }

      if (data && isMounted) {
        const carData = { id: data.id, ...data };
        carData.description = carData.description || '';
        setCar(carData);
        setLoading(false);
      }
    };

    fetchCar();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => {
      const newIndex = prev === 0 ? car.medias.length - 1 : prev - 1;
      if (modalImg) {
        setModalImg(car.medias[newIndex]);
      }
      return newIndex;
    });
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => {
      const newIndex = prev === car.medias.length - 1 ? 0 : prev + 1;
      if (modalImg) {
        setModalImg(car.medias[newIndex]);
      }
      return newIndex;
    });
  };

  const handleAddToFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast.success('Voiture ajoutée aux favoris !');
      setTimeout(() => navigate('/favorites'), 100);
    } else {
      toast.error('Cette voiture est déjà dans vos favoris !');
    }
  };

  const handleContactSeller = () => {
    const productUrl = window.location.href;
    const whatsappMessage = `Bonjour, je suis intéressé par :\n\n- Marque : ${car.marque}\n- Modèle : ${car.modele}\n- Année : ${car.annee}\n- Prix : ${formatPrice(car.prix)}${car.promotion ? `\n- Promotion : ${car.promotion.label}` : ''}\n\nLien du produit : ${productUrl}`;
    const encodedWhatsappMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${car.sellerNumber}?text=${encodedWhatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading || !car) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-white bg-gray-900 min-h-screen">
        <div className="mb-4 sm:mb-6">
          <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gold shadow-lg">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-full aspect-[16/9] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-16 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-16 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-full sm:w-40 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-900 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 text-gold text-lg font-semibold flex items-center hover:text-yellow-400 transition"
        aria-label="Retour à la page précédente"
      >
        <span className="mr-2 text-xl">←</span> Retour
      </button>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gold shadow-lg">
            <div className="relative mb-4 sm:mb-6">
              {car.status === 'acheté' && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold shadow">
                  Déjà Vendu
                </div>
              )}
              {car.promotion && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs sm:text-sm font-bold shadow">
                  {car.promotion.label}
                </div>
              )}
              {car.isFeatured && (
                <div className="absolute top-12 right-2 bg-green-400 text-black px-2 py-1 rounded text-xs sm:text-sm font-bold shadow">
                  En Vedette
                </div>
              )}
              {car.medias?.length > 0 && (
                <div className="relative w-full">
                  {car.medias[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={car.medias[currentMediaIndex]}
                      controls
                      className="car-detail-media w-full rounded-lg"
                      aria-label={`Vidéo de ${car.marque} ${car.modele}`}
                    />
                  ) : (
                    <img
                      src={car.medias[currentMediaIndex]}
                      alt={`${car.marque} ${car.modele}`}
                      className="car-detail-media w-full rounded-lg cursor-pointer"
                      onClick={() => setModalImg(car.medias[currentMediaIndex])}
                      loading="lazy"
                    />
                  )}
                  {car.medias.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevMedia}
                        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-gold text-black rounded-full p-2 hover:bg-yellow-400 transition"
                        aria-label="Média précédent"
                      >
                        <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextMedia}
                        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-gold text-black rounded-full p-2 hover:bg-yellow-400 transition"
                        aria-label="Média suivant"
                      >
                        <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 justify-center pb-2">
                      {car.medias.map((url, i) => (
                        <div
                          key={i}
                          className={`car-detail-thumbnail border-2 ${i === currentMediaIndex ? 'border-gold' : 'border-gray-300 dark:border-gray-600'}`}
                          onClick={() => setCurrentMediaIndex(i)}
                        >
                          {url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <div className="relative w-full h-full">
                              <video
                                src={url}
                                className="w-full h-full object-cover rounded-md"
                                aria-label={`Miniature vidéo ${i + 1}`}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={url}
                              alt={`Miniature ${i + 1} de ${car.marque} ${car.modele}`}
                              className="w-full h-full object-cover rounded-md"
                              loading="lazy"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gold mb-2">{car.marque} {car.modele}</h1>
            <div className="text-base sm:text-lg text-gray-800 dark:text-gray-300 mb-2">{car.annee} • {car.ville} • {car.carburant} • {car.boite}</div>
            <div className="text-lg sm:text-xl font-bold text-gold mb-2">{formatPrice(car.prix)}</div>
            <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">{car.type} - {car.sousType}</div>
            {car.provenance && (
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                Provenance : {car.provenance}
              </div>
            )}
            {car.startDate && car.type === 'Location' && (
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                Date de début : {new Date(car.startDate).toLocaleDateString()}
              </div>
            )}
            <p className="text-gray-800 dark:text-gray-300 mb-4">{car.description || 'Aucune description disponible.'}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactSeller}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                aria-label="Contacter le vendeur via WhatsApp"
              >
                Contacter le vendeur
              </button>
              <button
                onClick={handleAddToFavorites}
                className="bg-gold text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
                aria-label="Ajouter aux favoris"
              >
                Ajouter aux favoris
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImg}
              alt="Agrandissement"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => setModalImg(null)}
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
              aria-label="Fermer l'image agrandie"
            >
              Fermer
            </button>
            <button
              onClick={handlePrevMedia}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gold text-black rounded-full p-2 hover:bg-yellow-400 transition"
              aria-label="Image précédente"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMedia}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gold text-black rounded-full p-2 hover:bg-yellow-400 transition"
              aria-label="Image suivante"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetail;