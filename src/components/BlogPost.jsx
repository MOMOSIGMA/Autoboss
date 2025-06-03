// src/components/BlogPost.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

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