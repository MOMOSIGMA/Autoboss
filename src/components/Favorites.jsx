// src/components/Favorites.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "../config/supabase";
import { toast } from 'react-toastify';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);

    const fetchCars = async () => {
      if (storedFavorites.length > 0) {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .in('id', storedFavorites);
        if (error) {
          console.error("Erreur lors de la récupération des voitures favorites:", error);
          toast.error('Erreur lors du chargement des favoris');
          setCars([]);
        } else {
          setCars(data || []);
        }
      }
    };
    fetchCars();
  }, []);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setCars(cars.filter(car => car.id !== id));
    toast.success('Voiture retirée des favoris !');
  };

  return (
    <div className="container mx-auto p-4 pt-20 mt-20 bg-gray-900 text-white min-h-screen">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Mes Favoris</h2>
      {favorites.length === 0 ? (
        <p className="text-white">Aucun favori pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cars.map(car => (
            <div key={car.id} className="bg-gray-800 p-4 rounded flex flex-col items-center">
              <Link
                to={`/voiture/${car.marque.toLowerCase().replace(/\s+/g, '-')}-${car.modele.toLowerCase().replace(/\s+/g, '-')}-${car.annee}-${car.ville.toLowerCase().replace(/\s+/g, '-')}/${car.id}`}
              >
                <img
                  src={car.medias?.[0] || '/default-car.jpg'}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                  loading="lazy"
                />
                <div className="font-bold text-center text-white">{car.marque} {car.modele}</div>
                <div className="text-sm text-gray-400">{formatPrice(car.prix)}</div>
              </Link>
              <button
                onClick={() => handleRemoveFavorite(car.id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;