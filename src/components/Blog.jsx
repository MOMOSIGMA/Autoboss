// src/components/Blog.jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

function Blog() {
  return (
    <div className="container mx-auto p-4 pt-20 bg-gray-900 min-h-screen">
      <Helmet>
        <title>Blog Autoboss - Conseils et Astuces sur les Voitures au Sénégal</title>
        <meta name="description" content="Découvrez des conseils et astuces pour acheter, louer, vendre ou importer une voiture au Sénégal sur le blog Autoboss." />
        <meta name="keywords" content="voitures Sénégal, conseils achat voiture, location voiture Dakar, Autoboss blog" />
        <meta property="og:title" content="Blog Autoboss - Conseils et Astuces sur les Voitures au Sénégal" />
        <meta property="og:description" content="Découvrez des conseils et astuces pour acheter, louer, vendre ou importer une voiture au Sénégal sur le blog Autoboss." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gold mb-6 text-center">Blog Autoboss</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(blogPosts).map((slug) => {
          const post = blogPosts[slug];
          return (
            <Link
              key={slug}
              to={`/blog/${slug}`}
              className="block bg-gray-800 p-4 rounded-lg border border-gold shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold text-gold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-400 mb-2">Publié le {post.date}</p>
              <p className="text-gray-300">{post.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Blog;