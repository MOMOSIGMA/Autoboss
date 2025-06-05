// src/components/TermsOfUse.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function TermsOfUse() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    if (termsAccepted) {
      localStorage.setItem('termsAccepted', 'true');
      toast.success('Merci d’avoir accepté les conditions !');
      navigate('/');
    } else {
      toast.error('Veuillez accepter les conditions pour continuer.');
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 mt-20 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Conditions d'Utilisation d'Autoboss</h1>
      <p className="mb-2"><strong>Date d'entrée en vigueur : 31 mai 2025</strong></p>
      <p className="mb-4">
        Bienvenue sur Autoboss, une plateforme en ligne conçue pour faciliter la mise en relation entre les parcs automobiles (vendeurs) et les acheteurs potentiels. En accédant ou en utilisant notre service, vous acceptez les présentes Conditions d'Utilisation. Veuillez les lire attentivement.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">1. Rôle d'Autoboss</h2>
      <p className="mb-4">
        Autoboss agit exclusivement en tant qu'intermédiaire entre les parcs automobiles et les acheteurs. Nous ne sommes ni vendeurs ni acheteurs des véhicules listés sur la plateforme. Toute transaction ou accord conclu entre les parties est de leur seule responsabilité. Autoboss ne garantit pas la qualité, l'état, la légalité ou l'authenticité des véhicules proposés, sauf dans la mesure où nous nous engageons à publier uniquement des offres authentiques vérifiées par nos soins.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">2. Engagement à l'Authenticité</h2>
      <p className="mb-4">
        Nous nous efforçons de publier des offres vérifiées et authentiques en collaborant avec les parcs automobiles. Cependant, nous déclinons toute responsabilité en cas d'erreur, de fraude ou de mauvaise foi de la part des vendeurs. Les utilisateurs sont invités à effectuer leurs propres vérifications avant toute transaction.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">3. Limitation de Responsabilité</h2>
      <p className="mb-4">
        Autoboss ne peut être tenu responsable des dommages directs, indirects, matériels ou immatériels résultant de l'utilisation de la plateforme, y compris mais sans s'y limiter : pertes financières, litiges entre acheteurs et vendeurs, ou inexactitudes dans les descriptions des véhicules. Les utilisateurs reconnaissent que toute interaction avec les vendeurs se fait à leurs propres risques.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">4. Notifications Push</h2>
      <p className="mb-4">
        Pour être informé en temps réel des nouvelles offres de voitures et profiter des meilleures opportunités, nous vous invitons à activer les notifications push lors de votre première visite. Ces notifications sont facultatives et peuvent être désactivées à tout moment via les paramètres de votre navigateur ou appareil. En activant les notifications, vous acceptez de recevoir des alertes concernant les nouvelles offres et promotions.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">5. Droit Applicable et Juridiction</h2>
      <p className="mb-4">
        Ces Conditions d'Utilisation sont régies par les lois en vigueur au Sénégal. Tout litige sera soumis à la juridiction compétente de Dakar.
      </p>
      <h2 className="text-xl font-bold text-yellow-400 mb-2">6. Modifications</h2>
      <p className="mb-4">
        Autoboss se réserve le droit de modifier ces Conditions d'Utilisation à tout moment. Les modifications seront effectives dès leur publication sur la plateforme. Votre utilisation continue de nos services après ces modifications constitue votre acceptation des nouvelles conditions.
      </p>
      <p className="mb-4">
        <strong>Contact</strong> : Pour toute question, contactez-nous au <a href="https://wa.me/+221762641751" className="text-yellow-400 underline hover:text-yellow-500">+221 76 264 17 51</a>.
      </p>
      {!localStorage.getItem('termsAccepted') && (
        <>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            J'accepte les conditions d'utilisation.
          </label>
          <button
            onClick={handleAccept}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            disabled={!termsAccepted}
          >
            Accepter
          </button>
        </>
      )}
    </div>
  );
}

export default TermsOfUse;