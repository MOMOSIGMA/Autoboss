import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Bouton WhatsApp flottant - Visible sur toutes les pages
 * Permet contact direct avec Autoboss via WhatsApp
 */
function FloatingWhatsAppButton() {
  const whatsappNumber = '+221762641751';
  const whatsappMessage = "Bonjour Autoboss! Je suis intéressé par vos voitures. Pouvez-vous m'aider?";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse-slow flex items-center justify-center"
      aria-label="Contactez-nous sur WhatsApp"
      title="Contactez-nous sur WhatsApp"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="absolute -left-32 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300">
        Contactez-nous!
      </span>
    </a>
  );
}

export default FloatingWhatsAppButton;
