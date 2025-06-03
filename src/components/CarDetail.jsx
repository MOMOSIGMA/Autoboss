import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';
import { Rating } from '@smastrom/react-rating';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLink, FaCopy } from 'react-icons/fa'; // Importation d'icônes modernes

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const maskEmail = (email) => {
  if (!email) return 'Utilisateur Anonyme';
  const [name, domain] = email.split('@');
  const maskedName = name.length > 3 ? name.substring(0, 3) + '****' : name + '****';
  return `${maskedName}@${domain}`;
};

function CarDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [modalImg, setModalImg] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsError, setReviewsError] = useState(null);
  const reviewsPerPage = 5;

  const fetchReviews = async () => {
    setReviewsError(null);
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('car_id', id);

    if (countError) {
      console.error('Erreur lors du comptage des avis:', countError.message);
      setTotalReviews(0);
    } else {
      setTotalReviews(count || 0);
    }

    const { data, error } = await supabase
      .from('reviews_with_user')
      .select('*')
      .eq('car_id', id)
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage - 1);

    if (error) {
      console.error('Erreur lors de la récupération des avis:', error.message);
      setReviewsError(error.message);
      toast.error('Erreur lors du chargement des avis');
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('reviews')
        .select('*')
        .eq('car_id', id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage - 1);

      if (fallbackError) {
        console.error('Erreur lors de la récupération des avis (fallback):', fallbackError.message);
        setReviews([]);
      } else {
        setReviews(fallbackData || []);
        const avg = fallbackData.length > 0
          ? fallbackData.reduce((sum, r) => sum + r.rating, 0) / fallbackData.length
          : 0;
        setAverageRating(avg);
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Avis récupérés:', data);
      }
      setReviews(data || []);
      const avg = data.length > 0
        ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
        : 0;
      setAverageRating(avg);
    }
  };

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
        console.error('Erreur lors de la récupération de la voiture:', error.message);
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
    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [id, currentPage]);

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

  const handleReviewChange = (e) => {
    setReview({ ...review, comment: e.target.value });
  };

  const handleRatingChange = (value) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Rating changed to:', value);
    }
    setReview({ ...review, rating: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User state:', user);
      }
      toast.error('Veuillez vous connecter pour laisser un avis');
      return;
    }
    if (!review.rating || !review.comment.trim()) {
      toast.error('Veuillez donner une note et un commentaire.');
      return;
    }
    const { error } = await supabase.from('reviews').insert({
      car_id: car.id,
      user_id: user.id,
      rating: review.rating,
      comment: review.comment,
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.error('Erreur lors de la soumission de l\'avis:', error.message);
      toast.error(error.message);
    } else {
      toast.success('Avis soumis avec succès !');
      setReview({ rating: 0, comment: '' });
      fetchReviews();
    }
  };

  const handleRetryFetchReviews = () => {
    fetchReviews();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalReviews / reviewsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papiers !');
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

  const shareUrl = window.location.href;
  const shareTitle = `${car.marque} ${car.modele} ${car.annee} à ${car.ville} - ${formatPrice(car.prix)}`;
  const shareDescription = car.description || `Découvrez cette ${car.marque} ${car.modele} (${car.annee}) à ${car.ville} pour ${formatPrice(car.prix)} sur Autoboss.`;

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-900 min-h-screen">
      <Helmet>
        <title>{`${car.marque} ${car.modele} ${car.annee} à ${car.ville} - Autoboss`}</title>
        <meta name="description" content={car.description || `Découvrez cette ${car.marque} ${car.modele} (${car.annee}) à ${car.ville} pour ${formatPrice(car.prix)}.`} />
        <meta name="keywords" content={`${car.marque}, ${car.modele}, ${car.annee}, ${car.ville}, voiture à vendre, voiture à louer, Autoboss`} />
        <meta property="og:title" content={`${car.marque} ${car.modele} ${car.annee} à ${car.ville} - Autoboss`} />
        <meta property="og:description" content={car.description || `Découvrez cette ${car.marque} ${car.modele} (${car.annee}) à ${car.ville} pour ${formatPrice(car.prix)}.`} />
        <meta property="og:image" content={car.medias?.[0] || '/logo.png'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
      </Helmet>
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
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
              <h3 className="text-lg font-semibold text-gold mr-4">Partager :</h3>
              <div className="flex gap-3">
                <WhatsappShareButton url={shareUrl} title={shareTitle} className="focus:outline-none">
                  <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition focus:outline-none" aria-label="Partager sur WhatsApp">
                    <FaWhatsapp className="h-6 w-6" />
                  </button>
                </WhatsappShareButton>
                <FacebookShareButton url={shareUrl} quote={shareTitle} className="focus:outline-none">
                  <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition focus:outline-none" aria-label="Partager sur Facebook">
                    <FaFacebookF className="h-6 w-6" />
                  </button>
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle} className="focus:outline-none">
                  <button className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition focus:outline-none" aria-label="Partager sur Twitter">
                    <FaTwitter className="h-6 w-6" />
                  </button>
                </TwitterShareButton>
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition focus:outline-none"
                  aria-label="Copier le lien"
                >
                  <FaCopy className="h-6 w-6" />
                </button>
              </div>
            </div>
            <section className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gold mb-4 flex items-center">
                Avis des utilisateurs
                {reviews.length > 0 && (
                  <span className="ml-2 text-sm bg-gold text-black px-2 py-1 rounded">
                    {averageRating.toFixed(1)} / 5
                  </span>
                )}
              </h2>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-6">
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-300">Votre note</label>
                    <Rating
                      value={review.rating}
                      onChange={handleRatingChange}
                      max={5}
                      style={{ maxWidth: 150 }}
                    />
                    {review.rating === 0 && (
                      <p className="text-red-500 text-sm mt-1">Veuillez sélectionner une note</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-300">Votre commentaire</label>
                    <textarea
                      name="comment"
                      value={review.comment}
                      onChange={handleReviewChange}
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gold"
                      rows="4"
                      required
                      placeholder="Partagez votre avis..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Soumettre l'avis
                  </button>
                </form>
              ) : (
                <p className="mb-4 text-gray-300">
                  Connectez-vous pour laisser un avis.{' '}
                  <Link to="/login" className="text-gold underline hover:text-yellow-400">
                    Se connecter
                  </Link>
                </p>
              )}
              {reviewsError ? (
                <div className="text-red-500 mb-4">
                  <p>Erreur lors du chargement des avis : {reviewsError}</p>
                  <button
                    onClick={handleRetryFetchReviews}
                    className="mt-2 bg-gold text-black px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Réessayer
                  </button>
                </div>
              ) : reviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-t border-gray-700 pt-4">
                        <div className="flex items-center mb-2">
                          <Rating
                            value={review.rating}
                            readOnly
                            max={5}
                            style={{ maxWidth: 120 }}
                          />
                          <span className="ml-2 text-sm text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                        <p className="text-sm text-gray-400">
                          Par : {review.user_email ? maskEmail(review.user_email) : 'Utilisateur Anonyme'}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      Affichage des avis {(currentPage - 1) * reviewsPerPage + 1}-
                      {Math.min(currentPage * reviewsPerPage, totalReviews)} sur {totalReviews}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-gold text-black hover:bg-yellow-400'} transition`}
                        aria-label="Page précédente des avis"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(totalReviews / reviewsPerPage)}
                        className={`px-3 py-1 rounded ${currentPage === Math.ceil(totalReviews / reviewsPerPage) ? 'bg-gray-600' : 'bg-gold text-black hover:bg-yellow-400'} transition`}
                        aria-label="Page suivante des avis"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-300">Aucun avis pour cette voiture.</p>
              )}
            </section>
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
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
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
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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