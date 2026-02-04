import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

/**
 * Modal de contact qui apparaît une seule fois par session
 * Encourage les utilisateurs à prendre contact
 */
function ScrollContactModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les conditions
    const termsAccepted = localStorage.getItem('autoboss_terms_accepted');
    const modalShownInSession = sessionStorage.getItem('autoboss_modal_shown');

    // Afficher les conditions si pas encore acceptées
    if (!termsAccepted) {
      setShowTerms(true);
    }

    const handleScroll = () => {
      // Afficher le modal après 40% du scroll (une seule fois par session)
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      // Ne afficher qu'une fois par session ET seulement si conditions acceptées
      if (scrollPercent > 40 && !modalShownInSession && termsAccepted) {
        setIsVisible(true);
        sessionStorage.setItem('autoboss_modal_shown', 'true');
        // Cache après 8 secondes
        setTimeout(() => setIsVisible(false), 8000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('autoboss_terms_accepted', 'true');
    setShowTerms(false);
  };

  // Modal d'acceptation des conditions
  if (showTerms) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Conditions de service</h2>
          <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto mb-4 text-sm text-gray-700">
            <p className="mb-3">
              Bienvenue sur <strong>Autoboss Sénégal</strong>, votre plateforme de confiance pour l'achat et la location de véhicules au Sénégal.
            </p>
            <p className="mb-3">
              En utilisant notre site, vous acceptez de recevoir des communications de contact via WhatsApp et appel téléphonique de la part de notre équipe pour vous assister dans vos recherches automobiles.
            </p>
            <p className="mb-3">
              Vos informations seront traitées avec confidentialité et ne seront jamais partagées avec des tiers sans votre consentement explicite.
            </p>
            <p>
              Pour toute question, contactez-nous à <strong>+221 76 264 17 51</strong> (WhatsApp & Appel).
            </p>
          </div>
          <button
            onClick={handleAcceptTerms}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition transform hover:scale-105"
          >
            J'accepte et continue
          </button>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 md:left-auto md:bottom-24 z-40 animate-slide-up max-w-xs">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-lg shadow-2xl border-2 border-yellow-600">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">Besoin d'aide?</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-black hover:text-gray-700 transition"
            aria-label="Fermer"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm mb-3">
          Vous avez des questions sur nos voitures? Notre équipe est prête à vous aider! 🚗
        </p>

        <div className="flex gap-2">
          <a
            href="https://wa.me/+221762641751?text=Bonjour%20Autoboss!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold text-sm transition transform hover:scale-105"
          >
            WhatsApp
          </a>
          <a
            href="tel:+221762641751"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold text-sm transition transform hover:scale-105"
          >
            Appeler
          </a>
        </div>
      </div>
    </div>
  );
}

export default ScrollContactModal;
