import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

// Marques et modèles connus
const MARQUES_MODELES = {
  Toyota: ["Corolla", "Yaris", "Hilux", "Land Cruiser", "Camry", "RAV4", "Avensis", "Prius", "Auris", "C-HR", "Supra", "Verso", "Aygo"],
  Peugeot: ["208", "308", "3008", "508", "2008", "206", "207", "405", "406", "Partner", "Expert", "Boxer"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Talisman", "Scenic", "Kangoo", "Laguna", "Duster", "Sandero"],
  Mercedes: ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "GLA", "GLC", "GLE", "GLS", "Sprinter", "Vito"],
  BMW: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "X1", "X3", "X5", "X6", "i3", "i8"],
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT"],
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "Touran", "Jetta", "Caddy", "Transporter", "Amarok"],
  Ford: ["Fiesta", "Focus", "Kuga", "EcoSport", "Mondeo", "Ranger", "Transit", "Mustang", "Explorer"],
  Nissan: ["Micra", "Qashqai", "Juke", "Navara", "X-Trail", "Note", "Almera", "Patrol", "Leaf"],
  Hyundai: ["i10", "i20", "i30", "Tucson", "Santa Fe", "Elantra", "Accent", "Kona", "Creta"],
  Kia: ["Picanto", "Rio", "Sportage", "Sorento", "Ceed", "Optima", "Soul", "Stonic"],
  Honda: ["Civic", "Accord", "CR-V", "Jazz", "HR-V", "Fit", "Pilot", "Odyssey"],
  Mitsubishi: ["Lancer", "Pajero", "Outlander", "ASX", "Eclipse Cross", "Colt"],
  LandRover: ["Range Rover", "Discovery", "Defender", "Freelander", "Evoque"],
  Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade"],
  Fiat: ["500", "Panda", "Tipo", "Punto", "Doblo", "Ducato", "Fiorino"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Zafira", "Meriva", "Vivaro"],
  Citroën: ["C1", "C3", "C4", "C5", "Berlingo", "Jumpy", "Jumper"],
  Suzuki: ["Swift", "Vitara", "Jimny", "Ignis", "Baleno", "S-Cross"],
  Dacia: ["Duster", "Sandero", "Logan", "Dokker", "Lodgy"],
  Chevrolet: ["Aveo", "Cruze", "Spark", "Captiva", "Orlando", "Malibu"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "MX-5"],
  Subaru: ["Impreza", "Forester", "Outback", "XV", "Legacy"],
  Skoda: ["Fabia", "Octavia", "Superb", "Kodiaq", "Karoq", "Rapid"],
  Volvo: ["V40", "V60", "V90", "XC40", "XC60", "XC90", "S60"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Roadster"],
};

const MARQUES = Object.keys(MARQUES_MODELES);

const VILLES = [
  "Dakar", "Guédiawaye", "Pikine", "Rufisque", "Bargny", "Keur Massar", "Sébikotane", "Diamniadio", "Thiès", "Mbour", "Tivaouane", "Saint-Louis", "Louga", "Richard-Toll", "Dagana", "Podor", "Matam", "Kanel", "Bakel", "Tambacounda", "Kédougou", "Kolda", "Velingara", "Sédhiou", "Ziguinchor", "Bignona", "Oussouye", "Kaolack", "Nioro du Rip", "Guinguinéo", "Fatick", "Foundiougne", "Gossas", "Kaffrine", "Birkilane", "Malem Hodar", "Autre"
];

const BOITES = ["Manuelle", "Automatique"];
const CARBURANTS = ["Essence", "Diesel", "Électrique", "Hybride", "GPL"];
const PROMOTION_TYPES = [
  { value: "percentage", label: "Réduction en pourcentage" },
  { value: "special", label: "Offre spéciale" },
];

export default function CarForm({ onSubmit, initialData, setEditingCar }) {
  const [car, setCar] = useState({
    marque: initialData?.marque || "",
    modele: initialData?.modele || "",
    modeleLibre: initialData?.modeleLibre || "",
    annee: initialData?.annee || "",
    carburant: initialData?.carburant || "",
    boite: initialData?.boite || "",
    type: initialData?.type || "Achat",
    sousType: initialData?.sousType || "",
    ville: initialData?.ville || "",
    prix: initialData?.prix || "",
    description: initialData?.description || "",
    selectedFiles: initialData?.selectedFiles || [],
    medias: initialData?.medias || [],
    mediasToRemove: initialData?.mediasToRemove || [],
    sellerNumber: initialData?.sellerNumber || "+221762641751",
    provenance: initialData?.provenance || "",
    isFeatured: initialData?.isFeatured || false,
    promotion: initialData?.promotion || null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [promotionType, setPromotionType] = useState(car.promotion?.type || "");
  const [promotionValue, setPromotionValue] = useState(car.promotion?.value || "");
  const [promotionLabel, setPromotionLabel] = useState(car.promotion?.label || "");

  useEffect(() => {
    if (initialData) {
      setCar({
        ...initialData,
        selectedFiles: initialData.selectedFiles || [],
        medias: initialData.medias || [],
        mediasToRemove: initialData.mediasToRemove || [],
        isFeatured: initialData.isFeatured || false,
        promotion: initialData.promotion || null,
      });
      if (initialData.promotion) {
        setPromotionType(initialData.promotion.type || "");
        setPromotionValue(initialData.promotion.value || "");
        setPromotionLabel(initialData.promotion.label || "");
      }
    }
  }, [initialData]);

  useEffect(() => {
    const urls = car.selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [car.selectedFiles]);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;
    const totalFiles = (car.medias?.length || 0) + car.selectedFiles.length + newFiles.length - (car.mediasToRemove?.length || 0);
    if (totalFiles > 6) {
      toast.error('Vous ne pouvez ajouter au maximum que 6 fichiers.');
      return;
    }
    if (newFiles.some(f => f.size > 5 * 1024 * 1024)) {
      toast.error("Chaque fichier doit faire moins de 5 Mo");
      return;
    }
    setCar({ ...car, selectedFiles: [...car.selectedFiles, ...newFiles] });
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = car.selectedFiles.filter((_, i) => i !== index);
    setCar({ ...car, selectedFiles: updatedFiles });
  };

  const handleRemoveMedia = (url) => {
    setCar({ ...car, mediasToRemove: [...car.mediasToRemove, url] });
  };

  const handlePreview = (url, file = null) => {
    setPreviewUrl({ url, file });
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  const handleMarqueChange = (e) => {
    setCar({ ...car, marque: e.target.value, modele: "", modeleLibre: "" });
  };

  const handleModeleChange = (e) => {
    setCar({ ...car, modele: e.target.value, modeleLibre: "" });
  };

  const handleModeleLibre = (e) => {
    setCar({ ...car, modeleLibre: e.target.value });
  };

  const handlePromotionChange = () => {
    if (promotionType && promotionLabel) {
      const promotion = {
        type: promotionType,
        label: promotionLabel,
        value: promotionType === "percentage" ? parseInt(promotionValue) || 0 : null,
      };
      setCar({ ...car, promotion });
    } else {
      setCar({ ...car, promotion: null });
    }
  };

  const getFinalModele = () => {
    if (car.modele === "__autre__") return car.modeleLibre;
    return car.modele;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...car, modele: getFinalModele() });
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-800 text-white p-4 rounded-md shadow max-w-lg mx-auto border border-gray-600"
    >
      <label>
        Marque
        <select
          value={car.marque}
          onChange={handleMarqueChange}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir une marque</option>
          {Object.keys(MARQUES_MODELES).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label>
        Modèle
        <select
          value={car.modele}
          onChange={handleModeleChange}
          required
          disabled={!car.marque}
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir un modèle</option>
          {car.marque && MARQUES_MODELES[car.marque]?.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
          <option value="__autre__">Autre (saisir manuellement)</option>
        </select>
        {car.modele === "__autre__" && (
          <input
            type="text"
            placeholder="Saisir le modèle"
            value={car.modeleLibre}
            onChange={handleModeleLibre}
            className="p-2 rounded bg-gray-700 text-white w-full mt-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        )}
      </label>
      <label>
        Année
        <input
          type="number"
          placeholder="Année"
          value={car.annee}
          onChange={(e) => setCar({ ...car, annee: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label>
        Carburant
        <select
          value={car.carburant}
          onChange={(e) => setCar({ ...car, carburant: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir</option>
          {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        Boîte
        <select
          value={car.boite}
          onChange={(e) => setCar({ ...car, boite: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir</option>
          {BOITES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label>
        Type
        <select
          value={car.type}
          onChange={(e) => setCar({ ...car, type: e.target.value, sousType: "" })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="Achat">Achat</option>
          <option value="Location">Location</option>
        </select>
      </label>
      <label>
        Sous-type
        <select
          value={car.sousType}
          onChange={(e) => setCar({ ...car, sousType: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir</option>
          {car.type === "Achat" && <>
            <option value="Neuf">Neuf</option>
            <option value="Occasion">Occasion</option>
            <option value="Certifié">Certifié</option>
          </>}
          {car.type === "Location" && <>
            <option value="Par jour">Par jour</option>
            <option value="Par semaine">Par semaine</option>
            <option value="Par mois">Par mois</option>
          </>}
        </select>
      </label>
      <label>
        Ville / Région
        <select
          value={car.ville}
          onChange={(e) => setCar({ ...car, ville: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Choisir</option>
          {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </label>
      <label>
        Prix (FCFA)
        <input
          type="number"
          placeholder="Prix"
          value={car.prix}
          onChange={(e) => setCar({ ...car, prix: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label>
        Numéro du Vendeur (WhatsApp)
        <input
          type="tel"
          placeholder="Numéro WhatsApp (+221...)"
          value={car.sellerNumber}
          onChange={(e) => setCar({ ...car, sellerNumber: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label>
        Provenance (Parking Auto)
        <input
          type="text"
          placeholder="Nom du parking auto"
          value={car.provenance}
          onChange={(e) => setCar({ ...car, provenance: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="col-span-1 md:col-span-2">
        Description
        <textarea
          placeholder="Description"
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          required
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </label>
      <label className="col-span-1 md:col-span-2">
        Mettre en vedette
        <input
          type="checkbox"
          checked={car.isFeatured}
          onChange={(e) => setCar({ ...car, isFeatured: e.target.checked })}
          className="ml-2"
        />
      </label>
      <label className="col-span-1 md:col-span-2">
        Promotion
        <select
          value={promotionType}
          onChange={(e) => {
            setPromotionType(e.target.value);
            handlePromotionChange();
          }}
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Aucune promotion</option>
          {PROMOTION_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        {promotionType === "percentage" && (
          <input
            type="number"
            placeholder="Pourcentage de réduction"
            value={promotionValue}
            onChange={(e) => {
              setPromotionValue(e.target.value);
              handlePromotionChange();
            }}
            className="p-2 rounded bg-gray-700 text-white w-full mt-2 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        )}
        {promotionType && (
          <input
            type="text"
            placeholder="Label de la promotion (ex: -20%, Offre du Jour)"
            value={promotionLabel}
            onChange={(e) => {
              setPromotionLabel(e.target.value);
              handlePromotionChange();
            }}
            className="p-2 rounded bg-gray-700 text-white w-full mt-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        )}
      </label>
      <label className="col-span-1 md:col-span-2">
        Photos/Vidéos (max 6, 5Mo chacun)
        <input
          type="file"
          accept="image/*,video/mp4,video/webm,video/ogg"
          onChange={handleFiles}
          multiple
          className="p-2 rounded bg-gray-700 text-white w-full"
          aria-label="Ajouter des fichiers média"
        />
      </label>
      <div className="col-span-1 md:col-span-2">
        <h4 className="text-white mb-2">Médias existants :</h4>
        {car.medias?.map((url, i) => (
          !car.mediasToRemove.includes(url) && (
            <div key={i} className="flex items-center gap-2 mb-2">
              {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={url} alt={`Media ${i + 1}`} className="w-20 h-20 object-cover rounded-md cursor-pointer" onClick={() => handlePreview(url)} />
              ) : (
                <video src={url} className="w-20 h-20 object-cover rounded-md cursor-pointer" onClick={() => handlePreview(url)} />
              )}
              <button
                type="button"
                onClick={() => handleRemoveMedia(url)}
                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          )
        ))}
        <h4 className="text-white mb-2 mt-4">Nouveaux fichiers sélectionnés :</h4>
        {car.selectedFiles.map((file, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            {previewUrls[i] && (
              file.type.startsWith('image/') ? (
                <img src={previewUrls[i]} alt={`Prévisualisation ${file.name}`} className="w-20 h-20 object-cover rounded-md cursor-pointer" onClick={() => handlePreview(previewUrls[i], file)} />
              ) : (
                <video src={previewUrls[i]} className="w-20 h-20 object-cover rounded-md cursor-pointer" onClick={() => handlePreview(previewUrls[i], file)} />
              )
            )}
            <span className="text-white">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(i)}
              className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <button className="bg-gold text-black p-2 rounded-md mt-2 col-span-1 md:col-span-2 hover:bg-yellow-400 transition font-semibold">
        {initialData ? "Modifier" : "Ajouter"}
      </button>

      {previewUrl && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={handleClosePreview}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            {previewUrl.file ? (
              previewUrl.file.type.startsWith('image/') ? (
                <img src={previewUrl.url} alt="Prévisualisation" className="max-h-[90vh] max-w-[90vw] object-contain" />
              ) : (
                <video src={previewUrl.url} controls className="max-h-[90vh] max-w-[90vw] object-contain" autoPlay />
              )
            ) : (
              previewUrl.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={previewUrl.url} alt="Prévisualisation" className="max-h-[90vh] max-w-[90vw] object-contain" />
              ) : (
                <video src={previewUrl.url} controls className="max-h-[90vh] max-w-[90vw] object-contain" autoPlay />
              )
            )}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              Fermer
            </button>
          </div>
        </div>,
        document.body
      )}
    </form>
  );
}