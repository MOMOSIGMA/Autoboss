import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const blogPosts = {
  'conseils-pour-acheter-une-voiture-doccasion': {
    title: 'Conseils pour Acheter une Voiture d’Occasion au Sénégal',
    content: `
      <p>Acheter une voiture d’occasion peut être une excellente option pour économiser de l’argent, mais cela comporte aussi des risques. Voici quelques conseils pour faire un achat malin :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Vérifiez l’historique du véhicule :</strong> Demandez les documents du véhicule pour vérifier son passé (accidents, réparations, etc.).</li>
        <li><strong>Faites inspecter la voiture :</strong> Faites appel à un mécanicien de confiance pour inspecter le moteur, la carrosserie et les pneus.</li>
        <li><strong>Négociez le prix :</strong> Comparez les prix sur des plateformes comme Autoboss pour obtenir une bonne affaire.</li>
        <li><strong>Testez la voiture :</strong> Faites un essai routier pour vous assurer que tout fonctionne correctement.</li>
      </ul>
      <p>Avec ces conseils, vous serez mieux préparé pour acheter une voiture d’occasion au Sénégal.</p>
    `,
    image: '/blog1.jpg',
    date: '2025-06-01',
  },
  'comment-louer-une-voiture-au-senegal': {
    title: 'Comment Louer une Voiture au Sénégal : Guide Complet',
    content: `
      <p>La location de voiture est une solution pratique pour les voyageurs ou les personnes ayant besoin d’un véhicule temporaire. Voici un guide pour louer une voiture au Sénégal :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Choisissez une plateforme fiable :</strong> Utilisez des sites comme Autoboss pour trouver des voitures disponibles à Dakar ou ailleurs.</li>
        <li><strong>Vérifiez les conditions :</strong> Assurez-vous de comprendre les termes de location (durée, assurance, dépôt).</li>
        <li><strong>Contactez le loueur :</strong> Communiquez directement avec le loueur via WhatsApp pour confirmer la disponibilité.</li>
        <li><strong>Inspectez la voiture :</strong> Avant de prendre la voiture, vérifiez son état pour éviter des frais supplémentaires.</li>
      </ul>
      <p>En suivant ces étapes, vous pourrez louer une voiture facilement et en toute sécurité au Sénégal.</p>
    `,
    image: '/blog2.jpg',
    date: '2025-06-02',
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