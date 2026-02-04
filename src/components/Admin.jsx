import { useState, useEffect } from 'react';
import { supabase } from "../config/supabase";
import { toast } from 'react-toastify';
import CarForm from './CarForm';
import { useNavigate, Link } from 'react-router-dom';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

const AdminLogin = ({ onLogin, login, setLogin }) => {
  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-gold mb-6 text-center">Connexion Admin</h2>
      <form onSubmit={onLogin} className="flex flex-col gap-4 max-w-sm mx-auto bg-gray-800 p-6 rounded-lg border border-gold">
        <input
          type="email"
          placeholder="Email"
          value={login.email}
          onChange={e => setLogin({ ...login, email: e.target.value })}
          className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          required
          aria-label="Email de connexion"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={login.password}
          onChange={e => setLogin({ ...login, password: e.target.value })}
          className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          required
          aria-label="Mot de passe de connexion"
        />
        <button type="submit" className="bg-gold text-black p-3 rounded hover:bg-yellow-400 transition font-semibold">
          Connexion
        </button>
      </form>
    </div>
  );
};

const CarManagement = ({ cars, editingCar, setEditingCar, fetchCars, loadingCars, handleAddCar, handleUpdateCar, handleDeleteCar, handleMarkAsSold, isSubmittingCar, isUploading }) => {
  const handleEditCar = (car) => {
    setEditingCar({ ...car, selectedFiles: [], mediasToRemove: [] });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold">{editingCar ? "Modifier une voiture" : "Ajouter une voiture"}</h2>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg border border-gold mb-8">
        <CarForm
          onSubmit={editingCar ? handleUpdateCar : handleAddCar}
          initialData={editingCar}
          setEditingCar={setEditingCar}
          isSubmitting={isSubmittingCar || isUploading}
        />
        {editingCar && (
          <button
            onClick={() => setEditingCar(null)}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            aria-label="Annuler la modification"
          >
            Annuler
          </button>
        )}
      </div>
      <h3 className="text-xl font-bold text-gold mb-4">Liste des voitures</h3>
      {loadingCars ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gold shadow-lg animate-pulse">
              <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded mb-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-gray-800 p-4 rounded-lg border border-gold shadow-lg">
              <div className="flex flex-col gap-2">
                <div className="font-bold text-white text-lg">{car.marque} {car.modele} ({car.annee})</div>
                <div className="text-gray-400">{car.type} - {car.sousType} - {car.ville}</div>
                <div className="text-gold font-semibold">{formatPrice(car.prix)}</div>
                <div className="text-gray-400">{car.carburant} - {car.boite}</div>
                {car.provenance && <div className="text-gray-400">Provenance : {car.provenance}</div>}
                {car.isFeatured && <div className="text-green-400">En vedette</div>}
                {car.promotion && <div className="text-yellow-400">Promotion : {car.promotion.label}</div>}
                <div className="text-gray-300">{car.description}</div>
                <div className="text-sm text-gray-400">Statut : {car.status || 'disponible'}</div>
                <div className="text-sm text-gray-400">Numéro du Vendeur : {car.sellerNumber}</div>
                <div className="flex gap-2 flex-wrap">
                  {car.medias && car.medias.map((url, i) =>
                    url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video key={i} src={url} controls className="w-40 h-24 rounded" aria-label={`Vidéo ${i + 1} de ${car.marque} ${car.modele}`} />
                    ) : (
                      <img key={i} src={url} alt={`Image ${i + 1} de ${car.marque} ${car.modele}`} className="w-40 h-24 object-cover rounded opacity-100" loading="lazy" />
                    )
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleEditCar(car)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  aria-label={`Modifier ${car.marque} ${car.modele}`}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleMarkAsSold(car.id, car.status)}
                  className={`px-4 py-2 rounded text-white transition ${car.status === 'acheté' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
                  aria-label={car.status === 'acheté' ? `Marquer ${car.marque} ${car.modele} comme disponible` : `Marquer ${car.marque} ${car.modele} comme acheté`}
                >
                  {car.status === 'acheté' ? 'Marquer comme disponible' : 'Marquer comme acheté'}
                </button>
                <button
                  onClick={() => handleDeleteCar(car.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  aria-label={`Supprimer ${car.marque} ${car.modele}`}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const PartnerManagement = ({ partners, loadingPartners, newPartner, setNewPartner, fetchPartners, handleAddPartner, handleDeletePartner, isAdmin, isSubmittingPartner }) => {
  return (
    <>
      <h3 className="text-xl font-bold text-gold mb-4 mt-8">Gérer les Partenaires</h3>
      <form onSubmit={handleAddPartner} className="bg-gray-800 p-6 rounded-lg border border-gold mb-6 max-w-md">
        <input
          type="text"
          placeholder="Nom du partenaire"
          value={newPartner.name}
          onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-gold"
          required
          aria-label="Nom du partenaire"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setNewPartner({ ...newPartner, logoFile: e.target.files[0] })}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          required
          aria-label="Logo du partenaire"
        />
        <button
          type="submit"
          className={`w-full bg-gold text-black p-3 rounded transition font-semibold ${!isAdmin || isSubmittingPartner ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
          disabled={!isAdmin || isSubmittingPartner}
        >
          {isSubmittingPartner ? 'Ajout en cours...' : (isAdmin ? 'Ajouter Partenaire' : 'Réservé aux admins')}
        </button>
      </form>
      {loadingPartners ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gold shadow-lg animate-pulse flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-700 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
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
                aria-label={`Supprimer ${partner.name}`}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

function Admin() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [partners, setPartners] = useState([]);
  const [newPartner, setNewPartner] = useState({ name: '', logoFile: null });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        setUser(session.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        if (error) {
          console.error('Erreur lors de la vérification du rôle:', error.message);
          if (isMounted) {
            toast.error('Erreur lors de la vérification des permissions. Contactez un administrateur.');
            navigate('/');
          }
        } else if (userData && userData.role === 'admin') {
          if (isMounted) {
            setIsAdmin(true);
            await fetchCars();
            await fetchPartners();
          }
        } else {
          // Si pas de données ou rôle non 'admin', l'utilisateur n'est pas admin
          if (isMounted) {
            setIsAdmin(false);
            // Pas de redirection ici, géré par le rendu conditionnel
          }
        }
      }
      if (isMounted) setIsLoadingRole(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        if (session) {
          supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data, error }) => {
              if (isMounted) {
                if (error) {
                  console.error('Erreur lors de la vérification du rôle:', error.message);
                  toast.error('Erreur lors de la vérification des permissions. Contactez un administrateur.');
                  navigate('/');
                } else if (data && data.role === 'admin') {
                  setIsAdmin(true);
                  fetchCars();
                  fetchPartners();
                } else {
                  setIsAdmin(false);
                }
              }
            });
        } else {
          if (isMounted) {
            setIsAdmin(false);
            // Ne pas rediriger immédiatement - l'utilisateur peut rester sur /admin et verra un message
          }
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchCars = async () => {
    setLoadingCars(true);
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.error('Erreur lors du chargement des voitures:', error);
      toast.error('Erreur lors du chargement des voitures');
    } else {
      setCars(data || []);
    }
    setLoadingCars(false);
  };

  const fetchPartners = async () => {
    setLoadingPartners(true);
    const { data, error } = await supabase.from('partners').select('*');
    if (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      toast.error('Erreur lors du chargement des partenaires');
    } else {
      setPartners(data || []);
    }
    setLoadingPartners(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    });
    if (error) {
      toast.error(`Erreur de connexion : ${error.message}`);
    } else {
      toast.success('Connexion réussie !');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnexion réussie');
  };

  const handleAddCar = async (car) => {
    if (isSubmittingCar || isUploading) {
      toast.info('Ajout en cours, veuillez patienter...');
      return;
    }
    if (!car.selectedFiles?.length) {
      toast.error('Veuillez ajouter au moins une image ou vidéo.');
      return;
    }
    if (car.selectedFiles.length > 6) {
      toast.error('Vous ne pouvez ajouter au maximum que 6 fichiers.');
      return;
    }
    setIsSubmittingCar(true);
    setIsUploading(true);
    setUploadProgress(0);
    const urls = [];
    const totalFiles = car.selectedFiles.length;
    let completedFiles = 0;
    const resetUpload = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setIsSubmittingCar(false);
    };

    for (const file of car.selectedFiles) {
      if (typeof file === 'string') {
        urls.push(file);
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 80);
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          urls.push(data.secure_url);
        } else {
          toast.error(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`);
          resetUpload();
          return;
        }
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 80);
      } catch (error) {
        toast.error('Erreur lors de l\'upload de l\'image');
        resetUpload();
        return;
      }
    }

    const { selectedFiles, modeleLibre, ...carData } = car;
    const { error } = await supabase.from('cars').insert({
      ...carData,
      medias: urls,
      status: 'disponible',
    });
    if (error) {
      toast.error(`Erreur : ${error.message}`);
    } else {
      setUploadProgress(100);
      fetchCars();
      toast.success('Voiture ajoutée avec succès !');
      // Réinitialiser le formulaire après ajout réussi
      setTimeout(() => {
        window.location.reload(); // Recharger pour vider complètement le formulaire
      }, 1000);
    }
    resetUpload();
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) {
      const { error } = await supabase.from("cars").delete().eq("id", carId);
      if (error) {
        toast.error(`Erreur : ${error.message}`);
      } else {
        fetchCars();
        toast.success("Voiture supprimée avec succès !");
      }
    }
  };

  const handleUpdateCar = async (car) => {
    if (isSubmittingCar || isUploading) {
      toast.info('Mise à jour en cours, veuillez patienter...');
      return;
    }
    if (!car.medias?.length && !car.selectedFiles?.length) {
      toast.error('Veuillez conserver ou ajouter au moins une image ou vidéo.');
      return;
    }
    if ((car.medias?.length || 0) + (car.selectedFiles?.length || 0) - (car.mediasToRemove?.length || 0) > 6) {
      toast.error('Vous ne pouvez avoir au maximum que 6 fichiers.');
      return;
    }
    setIsSubmittingCar(true);
    setIsUploading(true);
    setUploadProgress(0);
    const existingMedias = car.medias.filter(url => !car.mediasToRemove.includes(url));
    const newUrls = [];
    const totalFiles = car.selectedFiles?.length || 0;
    let completedFiles = 0;
    const resetUpload = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setIsSubmittingCar(false);
    };

    if (totalFiles > 0) {
      for (const file of car.selectedFiles) {
        if (typeof file === 'string') {
          newUrls.push(file);
          completedFiles++;
          setUploadProgress((completedFiles / totalFiles) * 80);
          continue;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.secure_url) {
            newUrls.push(data.secure_url);
          } else {
            toast.error(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`);
            resetUpload();
            return;
          }
          completedFiles++;
          setUploadProgress((completedFiles / totalFiles) * 80);
        } catch (error) {
          toast.error('Erreur lors de l\'upload de l\'image');
          resetUpload();
          return;
        }
      }
    }

    const updatedMedias = [...existingMedias, ...newUrls];
    const carData = {
      marque: car.marque,
      modele: car.modele,
      annee: car.annee,
      carburant: car.carburant,
      boite: car.boite,
      type: car.type,
      sousType: car.sousType,
      ville: car.ville,
      prix: car.prix,
      description: car.description,
      sellerNumber: car.sellerNumber,
      provenance: car.provenance,
      medias: updatedMedias,
      isFeatured: car.isFeatured,
      promotion: car.promotion,
    };

    const { error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', car.id);
    if (error) {
      toast.error(`Erreur : ${error.message}`);
    } else {
      setUploadProgress(100);
      setEditingCar(null);
      fetchCars();
      toast.success('Voiture modifiée avec succès !');
    }
    resetUpload();
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (isSubmittingPartner) {
      toast.info('Ajout du partenaire en cours...');
      return;
    }
    if (!isAdmin) {
      toast.error("Vous devez être admin pour ajouter un partenaire.");
      return;
    }
    if (!newPartner.name || !newPartner.logoFile) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setIsSubmittingPartner(true);
    const formData = new FormData();
    formData.append('file', newPartner.logoFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
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
          toast.error(`Erreur : ${error.message}`);
        } else {
          fetchPartners();
          setNewPartner({ name: '', logoFile: null });
          toast.success('Partenaire ajouté avec succès !');
        }
      } else {
        toast.error(`Erreur Cloudinary : ${data.error?.message || 'Upload échoué'}`);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      const { error } = await supabase.from('partners').delete().eq('id', partnerId);
      if (error) {
        toast.error(`Erreur : ${error.message}`);
      } else {
        fetchPartners();
        toast.success('Partenaire supprimé');
      }
    }
  };

  const handleMarkAsSold = async (carId, currentStatus) => {
    const newStatus = currentStatus === 'acheté' ? 'disponible' : 'acheté';
    const { error } = await supabase
      .from('cars')
      .update({ status: newStatus })
      .eq('id', carId);
    if (error) {
      toast.error(`Erreur : ${error.message}`);
    } else {
      fetchCars();
      toast.success(newStatus === 'acheté' ? 'Voiture marquée comme vendue !' : 'Voiture marquée comme disponible !');
    }
  };

  if (!user) {
    return <AdminLogin onLogin={handleLogin} login={login} setLogin={setLogin} />;
  }

  if (isLoadingRole) {
    return (
      <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen text-white text-center">
        Chargement des permissions...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen text-white text-center">
        <h2 className="text-2xl font-bold text-gold mb-6">Accès Admin</h2>
        <p className="mb-4">Vous êtes connecté mais pas enregistré en tant qu'administrateur.</p>
        <p className="mb-6 text-yellow-400">Pour utiliser le panel admin, contactez un administrateur ou créez un compte admin dans Supabase.</p>
        <Link to="/" className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-400 transition font-semibold mr-2">
          Retourner à l'accueil
        </Link>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-4 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold">Administration</h2>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" aria-label="Déconnexion">
          Déconnexion
        </button>
      </div>
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg border-2 border-gold shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gold mb-4 text-center">Ajout en cours...</h3>
            <div className="w-full bg-gray-700 rounded-full h-6 mb-4">
              <div
                className="bg-gold h-6 rounded-full transition-all duration-300 flex items-center justify-center text-black font-bold text-sm"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress > 10 && `${Math.round(uploadProgress)}%`}
              </div>
            </div>
            <p className="text-white text-center text-lg">Progression : {Math.round(uploadProgress)}%</p>
            <p className="text-gray-400 text-center text-sm mt-2">Veuillez patienter, ne fermez pas cette page...</p>
          </div>
        </div>
      )}
      <CarManagement
        cars={cars}
        editingCar={editingCar}
        setEditingCar={setEditingCar}
        fetchCars={fetchCars}
        loadingCars={loadingCars}
        handleAddCar={handleAddCar}
        handleUpdateCar={handleUpdateCar}
        handleDeleteCar={handleDeleteCar}
        handleMarkAsSold={handleMarkAsSold}
        isSubmittingCar={isSubmittingCar}
        isUploading={isUploading}
      />
      <PartnerManagement
        partners={partners}
        loadingPartners={loadingPartners}
        newPartner={newPartner}
        setNewPartner={setNewPartner}
        fetchPartners={fetchPartners}
        handleAddPartner={handleAddPartner}
        handleDeletePartner={handleDeletePartner}
        isAdmin={isAdmin}
        isSubmittingPartner={isSubmittingPartner}
      />
    </div>
  );
}

export default Admin;