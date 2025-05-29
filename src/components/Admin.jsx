import { useState, useEffect } from 'react';
import { supabase } from "../config/supabase";
import CarForm from './CarForm';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

function Admin() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [partners, setPartners] = useState([]);
  const [newPartner, setNewPartner] = useState({ name: '', logoFile: null });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(userData?.role === 'admin');
        if (userData?.role === 'admin') {
          fetchCars();
          fetchPartners();
        }
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === 'admin');
            if (data?.role === 'admin') {
              fetchCars();
              fetchPartners();
            }
          });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.error('Erreur lors du chargement des voitures:', error);
      window.addToast('Erreur lors du chargement des voitures', 'error');
    } else {
      setCars(data || []);
    }
  };

  const fetchPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*');
    if (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      window.addToast('Erreur lors du chargement des partenaires', 'error');
    } else {
      setPartners(data || []);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    });
    if (error) {
      window.addToast(`Erreur de connexion : ${error.message}`, 'error');
    } else {
      window.addToast('Connexion réussie !', 'success');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.addToast('Déconnexion réussie', 'success');
  };

// Remplace les parties concernées dans Admin.jsx
const handleAddCar = async (car) => {
  const urls = [];
  for (const file of car.files) {
    if (typeof file === 'string') {
      urls.push(file);
      continue;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Utilise la variable d'environnement
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      } else {
        window.addToast(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`, 'error');
        return;
      }
    } catch (error) {
      window.addToast('Erreur lors de l\'upload de l\'image', 'error');
      return;
    }
  }
  const { files, modeleLibre, ...carData } = car;
  const { error } = await supabase.from('cars').insert({
    ...carData,
    medias: urls,
    status: 'disponible',
  });
  if (error) {
    window.addToast(`Erreur : ${error.message}`, 'error');
  } else {
    fetchCars();
    window.addToast('Voiture ajoutée avec succès !', 'success');
  }
};

const handleUpdateCar = async (car) => {
  const urls = [];
  for (const file of car.files) {
    if (typeof file === 'string') {
      urls.push(file);
      continue;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Utilise la variable d'environnement
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      } else {
        window.addToast(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`, 'error');
        return;
      }
    } catch (error) {
      window.addToast('Erreur lors de l\'upload de l\'image', 'error');
      return;
    }
  }
  const { files, modeleLibre, ...carData } = car;
  const { error } = await supabase
    .from('cars')
    .update({ ...carData, medias: urls })
    .eq('id', car.id);
  if (error) {
    window.addToast(`Erreur : ${error.message}`, 'error');
  } else {
    setEditingCar(null);
    fetchCars();
    window.addToast('Voiture modifiée avec succès !', 'success');
  }
};

const handleAddPartner = async (e) => {
  e.preventDefault();
  if (!isAdmin) {
    window.addToast("Vous devez être admin pour ajouter un partenaire.", 'error');
    return;
  }
  if (!newPartner.name || !newPartner.logoFile) {
    window.addToast("Veuillez remplir tous les champs.", 'error');
    return;
  }
  const formData = new FormData();
  formData.append('file', newPartner.logoFile);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Utilise la variable d'environnement
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      const { error } = await supabase.from('partners').insert({
        name: newPartner.name,
        logo: data.secure_url,
      });
      if (error) {
        window.addToast(`Erreur : ${error.message}`, 'error');
      } else {
        fetchPartners();
        setNewPartner({ name: '', logoFile: null });
        window.addToast('Partenaire ajouté avec succès !', 'success');
      }
    } else {
      window.addToast(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`, 'error');
    }
  } catch (error) {
    window.addToast('Erreur lors de l\'upload du logo', 'error');
  }
};

  const handleDeletePartner = async (partnerId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      const { error } = await supabase.from('partners').delete().eq('id', partnerId);
      if (error) {
        window.addToast(`Erreur : ${error.message}`, 'error');
      } else {
        fetchPartners();
        window.addToast('Partenaire supprimé', 'success');
      }
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gold mb-6 text-center">Connexion Admin</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto bg-gray-800 p-6 rounded-lg border border-gold">
          <input
            type="email"
            placeholder="Email"
            value={login.email}
            onChange={e => setLogin({ ...login, email: e.target.value })}
            className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
            className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <button className="bg-gold text-black p-3 rounded hover:bg-yellow-400 transition font-semibold">
            Connexion
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold">{editingCar ? "Modifier une voiture" : "Ajouter une voiture"}</h2>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Déconnexion
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg border border-gold mb-8">
        <CarForm onSubmit={editingCar ? handleUpdateCar : handleAddCar} initialData={editingCar} />
        {editingCar && (
          <button
            onClick={() => setEditingCar(null)}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Annuler
          </button>
        )}
      </div>
      <h3 className="text-xl font-bold text-gold mb-4">Liste des voitures</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="bg-gray-800 p-4 rounded-lg border border-gold shadow-lg">
            <div className="flex flex-col gap-2">
              <div className="font-bold text-white text-lg">{car.marque} {car.modele} ({car.annee})</div>
              <div className="text-gray-400">{car.type} - {car.sousType} - {car.ville}</div>
              <div className="text-gold font-semibold">{formatPrice(car.prix)}</div>
              <div className="text-gray-400">{car.carburant} - {car.boite}</div>
              {car.provenance && <div className="text-gray-400">Provenance : {car.provenance}</div>}
              <div className="text-gray-300">{car.description}</div>
              <div className="text-sm text-gray-400">Statut : {car.status || 'disponible'}</div>
              <div className="text-sm text-gray-400">Numéro du Vendeur : {car.sellerNumber}</div>
              <div className="flex gap-2 flex-wrap">
                {car.medias && car.medias.map((url, i) =>
                  url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video key={i} src={url} controls className="w-40 h-24 rounded" />
                  ) : (
                    <img key={i} src={url} alt={`Image ${i + 1}`} className="w-40 h-24 object-cover rounded opacity-100" loading="lazy" />
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => handleEditCar(car)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleMarkAsSold(car.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                disabled={car.status === 'acheté'}
              >
                Marquer comme acheté
              </button>
              <button
                onClick={() => handleDeleteCar(car.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-bold text-gold mb-4 mt-8">Gérer les Partenaires</h3>
      <form onSubmit={handleAddPartner} className="bg-gray-800 p-6 rounded-lg border border-gold mb-6 max-w-md">
        <input
          type="text"
          placeholder="Nom du partenaire"
          value={newPartner.name}
          onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-gold"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setNewPartner({ ...newPartner, logoFile: e.target.files[0] })}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
        />
        <button className="w-full bg-gold text-black p-3 rounded hover:bg-yellow-400 transition font-semibold">
          Ajouter Partenaire
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(partner => (
          <div key={partner.id} className="bg-gray-800 p-4 rounded-lg border border-gold shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              {partner.logo && (
                <img src={partner.logo} alt={`${partner.name} logo`} className="w-20 h-20 object-contain rounded" loading="lazy" />
              )}
              <div className="text-white font-semibold">{partner.name}</div>
            </div>
            <button
              onClick={() => handleDeletePartner(partner.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;