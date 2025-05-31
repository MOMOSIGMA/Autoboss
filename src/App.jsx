import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './config/supabase';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Home from './components/Home';
import CarDetail from './components/CarDetail';
import Admin from './components/Admin';
import Layout from './components/Layout';
import Partners from './components/Partners';
import Favorites from './components/Favorites';
import ContactForm from './components/ContactForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

function Achat({ cars }) { // Accepte cars comme prop
  const filteredCars = cars.filter(car => car.type === 'Achat');
  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Vendre</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à vendre pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/details/${car.id}`} key={car.id} className="block group">
              <div className="bg-white text-black p-2 rounded-xl border border-gold shadow hover:shadow-2xl transition relative">
                <img src={car.medias?.[0]} alt={`${car.marque} ${car.modele}`} className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition" loading="lazy" />
                <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-xs font-bold shadow">{(car.prix || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'}</div>
                {car.status === 'acheté' && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    Déjà Vendu
                  </div>
                )}
                <div className="p-1">
                  <div className="font-bold text-base">{car.marque} {car.modele}</div>
                  <div className="text-xs text-gray-500">{car.annee} • {car.ville}</div>
                  <div className="text-xs text-gray-500">{car.carburant} • {car.boite}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Location({ cars }) { // Accepte cars comme prop
  const filteredCars = cars.filter(car => car.type === 'Location');
  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-2">Voitures à Louer</h2>
      {filteredCars.length === 0 ? (
        <p className="text-white">Aucune voiture à louer pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCars.map(car => (
            <Link to={`/details/${car.id}`} key={car.id} className="block group">
              <div className="bg-white text-black p-2 rounded-xl border border-gold shadow hover:shadow-2xl transition relative">
                <img src={car.medias?.[0]} alt={`${car.marque} ${car.modele}`} className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition" loading="lazy" />
                <div className="absolute top-2 right-2 bg-gold text-black px-2 py-1 rounded text-xs font-bold shadow">{(car.prix || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'}</div>
                {car.status === 'acheté' && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    Déjà Vendu
                  </div>
                )}
                <div className="p-1">
                  <div className="font-bold text-base">{car.marque} {car.modele}</div>
                  <div className="text-xs text-gray-500">{car.annee} • {car.ville}</div>
                  <div className="text-xs text-gray-500">{car.carburant} • {car.boite}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SecretAdminAccess() {
  return <Navigate to="/admin" replace />;
}

function App() {
  const [cars, setCars] = useState([]); // État centralisé pour les voitures

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des voitures');
      } else {
        setCars(data);
      }
    };
    fetchCars();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout cars={cars} />}> {/* Passe cars à Layout */}
          <Route path="/" element={<><Home cars={cars} /><Partners /></>} /> {/* Passe cars à Home */}
          <Route path="/details/:id" element={<><CarDetail /><Partners /></>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/achat" element={<Achat cars={cars} />} /> {/* Passe cars à Achat */}
          <Route path="/location" element={<Location cars={cars} />} /> {/* Passe cars à Location */}
          <Route path="/secret-admin-access" element={<SecretAdminAccess />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </BrowserRouter>
  );
}

export default App;