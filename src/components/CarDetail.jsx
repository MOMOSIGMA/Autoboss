import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';
import { Rating } from '@smastrom/react-rating';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy } from 'react-icons/fa';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const maskEmail = (email) => {
  if (!email) return 'Utilisateur Anonyme';
  const [name, domain] = email.split('@');
  const maskedName = name.length > 3 ? name.substring(0, 3) + '****' : name + '****';
  return `${maskedName}@${domain}`;
};

const transformCloudinaryUrl = (url) => {
  if (url && url.includes('res.cloudinary.com')) {
    return url.replace(/\/upload\//, '/upload/w_800,q_auto,f_auto/');
  }
  return url;
};

function CarDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
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

  // Bloquer le scroll de l'arrière-plan lorsque la modale plein écran est ouverte
  useEffect(() => {
    if (fullScreenOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullScreenOpen]);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? car.medias.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev === car.medias.length - 1 ? 0 : prev + 1));
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
            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-xl border border-gray-500/30 shadow-lg">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-full aspect-[16/9] bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-16 rounded-md bg-gray-600 animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="h-8 w-3/4 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/3 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-16 w-full bg-gray-600 rounded animate-pulse mb-4"></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40 h-10 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="w-full sm:w-40 h-10 bg-gray-600 rounded-lg animate-pulse"></div>
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
    <div className="container mx-auto p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      <Helmet>
        <title>{`${car.marque} ${car.modele} ${car.annee} à ${car.ville} - Autoboss`}</title>
        <meta name="description" content={car.description || `Découvrez cette ${car.marque} ${car.modele} (${car.annee}) à ${car.ville} pour ${formatPrice(car.prix)}.`} />
        <meta name="keywords" content={`${car.marque}, ${car.modele}, ${car.annee}, ${car.ville}, voiture à vendre, voiture à louer, Autoboss`} />
        <meta property="og:title" content={`${car.marque} ${car.modele} ${car.annee} à ${car.ville} - Autoboss`} />
        <meta property="og:description" content={car.description || `Découvrez cette ${car.marque} ${car.modele} (${car.annee}) à ${car.ville} pour ${formatPrice(car.prix)}.`} />
        <meta property="og:image" content={transformCloudinaryUrl(car.medias?.[0]) || '/logo.png'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
      </Helmet>
      <button
        onClick={() => navigate(-1) || navigate('/')}
        className="mb-4 sm:mb-6 text-yellow-400 text-lg font-semibold flex items-center hover:text-yellow-500 transition"
        aria-label="Retour à la page précédente"
      >
        <span className="mr-2 text-xl">←</span> Retour
      </button>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-xl border border-gray-500/30 shadow-lg">
            <div className="relative mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2">
                {car.status === 'acheté' && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                    Déjà Vendu
                  </span>
                )}
                {car.isFeatured && (
                  <span className="bg-green-400 text-black px-2 py-1 rounded-full text-xs font-bold shadow">
                    En Vedette
                  </span>
                )}
                {car.promotion && (
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold shadow">
                    {car.promotion.label}
                  </span>
                )}
              </div>
              {car.medias?.length > 0 && (
                <div className="relative flex flex-col items-center">
                  {car.medias[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                      controls
                      className="w-full max-w-md h-64 md:max-w-4xl md:h-[28rem] rounded-lg"
                      aria-label={`Vidéo de ${car.marque} ${car.modele}`}
                    />
                  ) : (
                    <img
                      src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                      alt={`${car.marque} ${car.modele}`}
                      className="w-full max-w-md h-64 md:max-w-4xl md:h-[28rem] object-cover rounded-lg cursor-pointer"
                      onClick={() => setFullScreenOpen(true)}
                      loading="lazy"
                    />
                  )}
                  {car.medias.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevMedia}
                        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
                        aria-label="Média précédent"
                      >
                        <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextMedia}
                        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-yellow-400 text-black rounded-full p-2 hover:bg-yellow-500 transition"
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
                          className={`border-2 ${i === currentMediaIndex ? 'border-yellow-400' : 'border-gray-600'} rounded-md cursor-pointer transition-all duration-200 hover:border-yellow-400`}
                          onClick={() => setCurrentMediaIndex(i)}
                        >
                          {url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <div className="relative w-16 h-16">
                              <video
                                src={transformCloudinaryUrl(url)}
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
                              src={transformCloudinaryUrl(url)}
                              alt={`Miniature ${i + 1} de ${car.marque} ${car.modele}`}
                              className="w-16 h-16 object-cover rounded-md"
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
            <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">{car.marque} {car.modele}</h1>
            <div className="text-lg text-gray-300 mb-2">{car.annee} • {car.ville} • {car.carburant} • {car.boite}</div>
            <div className="text-2xl font-bold text-yellow-400 mb-2">{formatPrice(car.prix)}</div>
            <div className="text-base font-semibold text-gray-200 mb-2 bg-gray-700 px-3 py-1 rounded">{car.type} - {car.sousType}</div>
            {car.provenance && (
              <div className="text-base font-semibold text-gray-200 mb-2 bg-gray-700 px-3 py-1 rounded">
                Provenance : {car.provenance}
              </div>
            )}
            {car.startDate && car.type === 'Location' && (
              <div className="text-base font-semibold text-gray-200 mb-2 bg-gray-700 px-3 py-1 rounded">
                Date de début : {new Date(car.startDate).toLocaleDateString()}
              </div>
            )}
            <p className="text-gray-300 mb-4">{car.description || 'Aucune description disponible.'}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactSeller}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
                aria-label="Contacter le vendeur via WhatsApp"
              >
                Contacter le vendeur
              </button>
              <button
                onClick={handleAddToFavorites}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                aria-label="Ajouter aux favoris"
              >
                Ajouter aux favoris
              </button>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
              <h3 className="text-lg font-semibold text-yellow-400 mr-4">Partager :</h3>
              <div className="flex gap-3">
                <WhatsappShareButton url={shareUrl} title={shareTitle} className="focus:outline-none">
                  <button className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-110" aria-label="Partager sur WhatsApp">
                    <FaWhatsapp className="h-6 w-6" />
                  </button>
                </WhatsappShareButton>
                <FacebookShareButton url={shareUrl} quote={shareTitle} className="focus:outline-none">
                  <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-110" aria-label="Partager sur Facebook">
                    <FaFacebookF className="h-6 w-6" />
                  </button>
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle} className="focus:outline-none">
                  <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-all duration-200 transform hover:scale-110" aria-label="Partager sur Twitter">
                    <FaTwitter className="h-6 w-6" />
                  </button>
                </TwitterShareButton>
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                  aria-label="Copier le lien"
                >
                  <FaCopy className="h-6 w-6" />
                </button>
              </div>
            </div>
            <section className="mt-6 backdrop-blur-md bg-white/10 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                Avis des utilisateurs
                {reviews.length > 0 && (
                  <span className="ml-2 text-sm bg-yellow-400 text-black px-2 py-1 rounded">
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
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      rows="4"
                      required
                      placeholder="Partagez votre avis..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Soumettre l'avis
                  </button>
                </form>
              ) : (
                <p className="mb-4 text-gray-300">
                  Connectez-vous pour laisser un avis.{' '}
                  <Link to="/login" className="text-yellow-400 underline hover:text-yellow-500">
                    Se connecter
                  </Link>
                </p>
              )}
              {reviewsError ? (
                <div className="text-red-500 mb-4">
                  <p>Erreur lors du chargement des avis : {reviewsError}</p>
                  <button
                    onClick={handleRetryFetchReviews}
                    className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition-all duration-200"
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
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-yellow-400 text-black hover:bg-yellow-500'} transition-all duration-200`}
                        aria-label="Page précédente des avis"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(totalReviews / reviewsPerPage)}
                        className={`px-3 py-1 rounded ${currentPage === Math.ceil(totalReviews / reviewsPerPage) ? 'bg-gray-600' : 'bg-yellow-400 text-black hover:bg-yellow-500'} transition-all duration-200`}
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

      {fullScreenOpen && car.medias?.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setFullScreenOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {car.medias[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                controls
                className="max-w-[90vw] max-h-[90vh] object-contain"
                autoPlay
              />
            ) : (
              <img
                src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                alt={`${car.marque} ${car.modele}`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            )}
            {car.medias.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevMedia(); }}
                  className="absolute left-4 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                  aria-label="Média précédent"
                >
                  ←
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextMedia(); }}
                  className="absolute right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
                  aria-label="Média suivant"
                >
                  →
                </button>
              </>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setFullScreenOpen(false); }}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-all duration-200 transform hover:scale-110 flex items-center gap-2"
              aria-label="Fermer l'image en plein écran"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm">Retour</span>
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-gray-500/30 shadow-2xl w-[80%] max-w-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                {car.medias?.length > 0 && (
                  car.medias[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                      controls
                      className="w-full max-w-md h-48 rounded-lg"
                      aria-label={`Vidéo de ${car.marque} ${car.modele}`}
                    />
                  ) : (
                    <img
                      src={transformCloudinaryUrl(car.medias[currentMediaIndex])}
                      alt={`${car.marque} ${car.modele}`}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  )
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">{car.marque} {car.modele}</h2>
                  <p className="text-lg text-gray-300 mb-2">{car.annee} • {car.ville}</p>
                  <p className="text-lg text-gray-300 mb-2">{car.carburant} • {car.boite}</p>
                  <p className="text-2xl font-bold text-yellow-400 mb-4">{formatPrice(car.prix)}</p>
                  <p className="text-gray-300">{car.description || 'Aucune description disponible.'}</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleContactSeller}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 animate-pulse"
                    aria-label="Contacter le vendeur via WhatsApp"
                  >
                    Contacter le vendeur
                  </button>
                  <button
                    onClick={handleAddToFavorites}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 animate-pulse"
                    aria-label="Ajouter aux favoris"
                  >
                    Ajouter aux favoris
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-600 text-white rounded-full p-2 hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
              aria-label="Fermer la modale"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetail;