import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const blogPosts = {
  'conseils-pour-acheter-une-voiture-doccasion': {
    title: 'Conseils pour Acheter une Voiture d’Occasion au Sénégal',
    content: `
      <p>Acheter une voiture d’occasion peut être une excellente option pour économiser de l’argent, mais cela comporte aussi des risques. Voici quelques conseils concrets pour réussir votre achat au Sénégal :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Vérifiez les papiers :</strong> Carte grise, assurance, visite technique, certificat de cession… vérifiez que tout est en règle.</li>
        <li><strong>Inspectez le véhicule :</strong> Faites-vous accompagner d’un mécanicien si possible. Vérifiez les pneus, le moteur, les freins et les signes d’accident.</li>
        <li><strong>Comparez les prix :</strong> Consultez des plateformes comme Autoboss pour voir si le prix demandé est raisonnable.</li>
        <li><strong>Négociez :</strong> Au Sénégal, la négociation est normale. Renseignez-vous d’abord sur la valeur réelle du véhicule.</li>
        <li><strong>Faites un essai routier :</strong> Testez la voiture en ville et sur route. Écoutez les bruits suspects et testez les freins.</li>
        <li><strong>Privilégiez les vendeurs transparents :</strong> Évitez ceux qui hésitent à donner des détails ou à vous montrer les papiers.</li>
      </ul>
      <p>En suivant ces étapes, vous limiterez les risques et ferez un achat plus sûr.</p>
    `,
    image: '/blog1.jpg',
    date: '2025-06-01',
  },
  'comment-louer-une-voiture-au-senegal': {
    title: 'Comment Louer une Voiture au Sénégal : Guide Complet',
    content: `
      <p>La location de voiture est une solution très pratique au Sénégal, que ce soit pour un séjour temporaire à Dakar, un déplacement à l'intérieur du pays ou pour éviter les transports en commun. Voici un guide complet basé sur la réalité locale :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Choisissez une plateforme fiable :</strong> Utilisez des sites locaux comme <em>Autoboss</em>, ou passez par des agences connues dans votre ville. Vérifiez les avis et demandez des photos récentes du véhicule.</li>
        <li><strong>Renseignez-vous sur les types de location :</strong> Il existe des locations avec ou sans chauffeur. Si vous n’êtes pas à l’aise avec la conduite dans les zones très fréquentées comme Dakar ou Pikine, préférez un chauffeur.</li>
        <li><strong>Préparez les documents nécessaires :</strong> Un permis de conduire valide est indispensable. Les loueurs acceptent souvent les permis étrangers, mais certains demandent un permis international pour les étrangers.</li>
        <li><strong>Vérifiez les conditions de location :</strong> Lisez bien les clauses sur l’assurance, la caution, le kilométrage, l'état des lieux, les retards, ou les frais de nettoyage. Attention aux frais cachés dans certains parkings ou agences informelles.</li>
        <li><strong>Inspectez le véhicule avant le départ :</strong> Prenez des photos (intérieur + extérieur) devant le loueur. Vérifiez pneus, freins, lumières, niveau de carburant. Demandez une feuille de sortie si l'agence est sérieuse.</li>
        <li><strong>Privilégiez les paiements traçables :</strong> Évitez les transactions 100 % en espèces. Optez pour Orange Money, Wave, ou virement si possible, avec reçu ou preuve.</li>
        <li><strong>Numéros utiles en cas de problème :</strong> Gardez le numéro du loueur, mais aussi celui d’un mécanicien local ou d’un agent de la circulation. Des pannes ou contrôles de routine sont fréquents sur les routes sénégalaises.</li>
      </ul>
      <p>En suivant ces conseils, vous augmentez vos chances d’avoir une location sans mauvaise surprise, que ce soit à Dakar, Thiès, Saint-Louis ou ailleurs.</p>
    `,
    image: '/blog2.jpg',
    date: '2025-06-02',
  },
  'comment-importer-une-voiture-au-senegal': {
    title: 'Comment Importer une Voiture au Sénégal : Étapes Clés',
    content: `
      <p>Importer une voiture au Sénégal peut être rentable, surtout pour les véhicules de qualité venant d’Europe, d’Amérique ou d’Asie. Voici les étapes à suivre :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Choisissez bien votre véhicule :</strong> Vérifiez la conformité à la réglementation locale (âge maximal, état, modèle autorisé).</li>
        <li><strong>Faites appel à un transitaire :</strong> Il s’occupera des démarches douanières et de l’acheminement du véhicule jusqu’au port de Dakar.</li>
        <li><strong>Préparez les documents :</strong> Facture d’achat, carte grise originale, certificat de cession, documents de transport (BL).</li>
        <li><strong>Calculez les frais de douane :</strong> Les frais peuvent représenter entre 50 et 80 % de la valeur du véhicule. Vérifiez auprès des douanes ou sur leur site.</li>
        <li><strong>Vérifiez le véhicule à l’arrivée :</strong> Inspectez le véhicule au port avant de l’enregistrer officiellement.</li>
        <li><strong>Immatriculez la voiture :</strong> Une fois la douane réglée, faites la visite technique, l’assurance, puis la plaque d’immatriculation sénégalaise.</li>
      </ul>
      <p>Importer une voiture demande rigueur, mais cela peut être une bonne affaire si les démarches sont bien gérées.</p>
    `,
    image: '/blog3.jpg',
    date: '2025-06-03',
  },
  'comment-vendre-rapidement-sa-voiture-au-senegal': {
    title: 'Comment Vendre Rapidement sa Voiture au Sénégal',
    content: `
      <p>Vous souhaitez vendre votre voiture sans perdre de temps ? Voici des astuces spécifiques au marché sénégalais pour maximiser vos chances :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Fixez un prix juste :</strong> Étudiez les prix sur Autoboss ou dans les parkings. Trop cher = personne n'appelle. Trop bas = perte sèche.</li>
        <li><strong>Soignez l’apparence :</strong> Nettoyez la voiture, passez à la station de lavage, faites briller la carrosserie. Une voiture propre attire plus facilement.</li>
        <li><strong>Faites de belles photos :</strong> Prenez des photos nettes à la lumière du jour, intérieur et extérieur. Montrez les points forts (tableau de bord, sièges, coffre...)</li>
        <li><strong>Décrivez honnêtement :</strong> Mentionnez l’état réel, les options, les petits défauts. La transparence crée la confiance.</li>
        <li><strong>Diffusez l’annonce au bon endroit :</strong> Autoboss, WhatsApp, groupes Facebook locaux, bouche à oreille dans les parkings.</li>
      </ul>
      <p>Avec un bon prix et une annonce bien faite, vous pouvez vendre rapidement, parfois en 1 ou 2 jours à Dakar.</p>
    `,
    image: '/blog4.jpg',
    date: '2025-06-04',
  },
};

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen text-white text-center">
        <h1 className="text-2xl font-bold text-gold mb-6">Article non trouvé</h1>
        <button
          onClick={() => navigate('/blog')}
          className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
        >
          Retourner au blog
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen">
      <Helmet>
        <title>{`${post.title} - Blog Autoboss`}</title>
        <meta name="description" content={post.content.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta name="keywords" content={`${post.title.split(' ')[0]}, voiture Sénégal, conseils, Autoboss`} />
        <meta property="og:title" content={`${post.title} - Blog Autoboss`} />
        <meta property="og:description" content={post.content.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <button
        onClick={() => navigate('/blog')}
        className="mb-4 text-gold text-lg font-semibold flex items-center hover:text-yellow-400 transition"
        aria-label="Retour au blog"
      >
        <span className="mr-2 text-xl">←</span> Retour au blog
      </button>
      <div className="bg-gray-800 p-6 rounded-lg border border-gold shadow-lg">
        <h1 className="text-3xl font-bold text-gold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-4">Publié le {post.date}</p>
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}

export default BlogPost;
