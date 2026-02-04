import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

/**
 * Modal de contact qui apparaît après scroll
 * Encourage les utilisateurs à prendre contact
 */
function ScrollContactModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le modal après 50% du scroll
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent > 40 && !hasSeenModal && !isVisible) {
        setIsVisible(true);
        setHasSeenModal(true);
        // Cache après 8 secondes
        setTimeout(() => setIsVisible(false), 8000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasSeenModal, isVisible]);

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
