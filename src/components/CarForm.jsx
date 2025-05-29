import { useState } from "react";
// Marques et modèles connus (extrait, tu peux en ajouter d'autres)
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
  // ...ajoute d'autres marques selon tes besoins
};

const MARQUES = Object.keys(MARQUES_MODELES);

const VILLES = [
  "Dakar", "Guédiawaye", "Pikine", "Rufisque", "Bargny", "Keur Massar", "Sébikotane", "Diamniadio", "Thiès", "Mbour", "Tivaouane", "Saint-Louis", "Louga", "Richard-Toll", "Dagana", "Podor", "Matam", "Kanel", "Bakel", "Tambacounda", "Kédougou", "Kolda", "Velingara", "Sédhiou", "Ziguinchor", "Bignona", "Oussouye", "Kaolack", "Nioro du Rip", "Guinguinéo", "Fatick", "Foundiougne", "Gossas", "Kaffrine", "Birkilane", "Malem Hodar", "Autre"
];

const BOITES = ["Manuelle", "Automatique"];
const CARBURANTS = ["Essence", "Diesel", "Électrique", "Hybride", "GPL"];

export default function CarForm({ onSubmit, initialData }) {
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
    files: initialData?.medias || [],
    sellerNumber: initialData?.sellerNumber || "+221762641751", // Numéro par défaut
    provenance: initialData?.provenance || "", // Nouveau champ pour la provenance
  });

  // Gère le changement de fichiers
  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.some(f => f.size > 5 * 1024 * 1024)) {
      alert("Chaque fichier doit faire moins de 5 Mo");
      return;
    }
    setCar({ ...car, files });
  };

  // Gère le changement de marque
  const handleMarqueChange = (e) => {
    setCar({ ...car, marque: e.target.value, modele: "", modeleLibre: "" });
  };

  // Gère le changement de modèle
  const handleModeleChange = (e) => {
    setCar({ ...car, modele: e.target.value, modeleLibre: "" });
  };

  // Gère le champ "autre modèle"
  const handleModeleLibre = (e) => {
    setCar({ ...car, modeleLibre: e.target.value });
  };

  // Récupère la valeur finale du modèle
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
      className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white text-black p-4 rounded shadow max-w-lg mx-auto"
    >
      <label>
        Marque
        <select
          value={car.marque}
          onChange={handleMarqueChange}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
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
          className="p-2 rounded bg-gray-100 text-black w-full"
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
            className="p-2 rounded bg-gray-100 text-black w-full mt-2"
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
          onChange={e => setCar({ ...car, annee: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <label>
        Carburant
        <select
          value={car.carburant}
          onChange={e => setCar({ ...car, carburant: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        >
          <option value="">Choisir</option>
          {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        Boîte
        <select
          value={car.boite}
          onChange={e => setCar({ ...car, boite: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        >
          <option value="">Choisir</option>
          {BOITES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label>
        Type
        <select
          value={car.type}
          onChange={e => setCar({ ...car, type: e.target.value, sousType: "" })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        >
          <option value="Achat">Achat</option>
          <option value="Location">Location</option>
        </select>
      </label>
      <label>
        Sous-type
        <select
          value={car.sousType}
          onChange={e => setCar({ ...car, sousType: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
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
          onChange={e => setCar({ ...car, ville: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
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
          onChange={e => setCar({ ...car, prix: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <label>
        Numéro du Vendeur (WhatsApp)
        <input
          type="tel"
          placeholder="Numéro WhatsApp (+221...)"
          value={car.sellerNumber}
          onChange={e => setCar({ ...car, sellerNumber: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <label>
        Provenance (Parking Auto)
        <input
          type="text"
          placeholder="Nom du parking auto"
          value={car.provenance}
          onChange={e => setCar({ ...car, provenance: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <label>
        Description
        <textarea
          placeholder="Description"
          value={car.description}
          onChange={e => setCar({ ...car, description: e.target.value })}
          required
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <label>
        Photos/Vidéos (max 3, 5Mo chacun)
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFiles}
          className="p-2 rounded bg-gray-100 text-black w-full"
        />
      </label>
      <button className="bg-gold text-black p-2 rounded mt-2 col-span-1 md:col-span-2">{initialData ? "Modifier" : "Ajouter"}</button>
    </form>
  );
}