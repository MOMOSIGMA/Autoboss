import { useState } from 'react';
import { supabase } from "../config/supabase";
import { toast } from 'react-toastify';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('fr', fr);

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    car_type: 'Achat',
    marque: '',
    modele: '',
    budget: '',
    details: '',
    notifications: false,
  });
  const [locationStart, setLocationStart] = useState(null);
  const [locationEnd, setLocationEnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (!formData.contact.trim()) {
      newErrors.contact = "Le contact est requis.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+221[0-9]{9}$/;
      if (!emailRegex.test(formData.contact) && !phoneRegex.test(formData.contact)) {
        newErrors.contact = "Veuillez entrer un email ou un numéro de téléphone valide (+221...).";
      }
    }
    if (formData.budget && formData.budget < 0) newErrors.budget = "Le budget ne peut pas être négatif.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await supabase.from('requests').insert({
      name: formData.name,
      contact: formData.contact,
      car_type: formData.car_type,
      marque: formData.marque || null,
      modele: formData.modele || null,
      budget: formData.budget ? parseInt(formData.budget) : null,
      details: formData.details || null,
      notifications: formData.notifications,
      location_start_date: formData.car_type === "Location" && locationStart ? locationStart.toISOString().split('T')[0] : null,
      location_end_date: formData.car_type === "Location" && locationEnd ? locationEnd.toISOString().split('T')[0] : null,
      created_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } else {
      toast.success("Demande envoyée avec succès !");
      setFormData({
        name: '',
        contact: '',
        car_type: 'Achat',
        marque: '',
        modele: '',
        budget: '',
        details: '',
        notifications: false,
      });
      setLocationStart(null);
      setLocationEnd(null);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 dark:text-yellow-300">Faites une Demande Spécifique</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-yellow-400 max-w-md mx-auto flex flex-col gap-4 dark:bg-gray-900 dark:border-yellow-300">
        {/* CHAMPS STANDARD */}
        <input
          type="text"
          placeholder="Votre nom"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

        <input
          type="text"
          placeholder="Email ou téléphone (+221...)"
          value={formData.contact}
          onChange={e => setFormData({ ...formData, contact: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
          required
        />
        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}

        <select
          value={formData.car_type}
          onChange={e => setFormData({ ...formData, car_type: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="Achat">Achat</option>
          <option value="Location">Location</option>
        </select>

        {formData.car_type === "Location" && (
          <div className="flex flex-col gap-2">
            <label className="text-white block dark:text-gray-200">Date de début :</label>
            <DatePicker
              selected={locationStart}
              onChange={(date) => setLocationStart(date)}
              dateFormat="dd/MM/yyyy"
              locale="fr"
              placeholderText="Choisissez la date de début"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
            />
            <label className="text-white block dark:text-gray-200">Date de fin :</label>
            <DatePicker
              selected={locationEnd}
              onChange={(date) => setLocationEnd(date)}
              dateFormat="dd/MM/yyyy"
              locale="fr"
              placeholderText="Choisissez la date de fin"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Marque (ex: Toyota)"
          value={formData.marque}
          onChange={e => setFormData({ ...formData, marque: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          placeholder="Modèle (ex: Corolla)"
          value={formData.modele}
          onChange={e => setFormData({ ...formData, modele: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="number"
          placeholder="Budget (en FCFA)"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}

        <textarea
          placeholder="Détails supplémentaires (ex: couleur, année)"
          value={formData.details}
          onChange={e => setFormData({ ...formData, details: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-gray-200"
          rows="4"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.notifications}
            onChange={e => setFormData({ ...formData, notifications: e.target.checked })}
            className="mr-2 rounded text-yellow-400 focus:ring-yellow-400 dark:text-yellow-300"
          />
          <span className="text-white dark:text-gray-200">Recevoir des notifications</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black p-2 rounded hover:bg-yellow-500 transition disabled:bg-yellow-300 flex items-center justify-center dark:bg-yellow-300 dark:hover:bg-yellow-400"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-black" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Patientez…
            </>
          ) : (
            "Envoyer la Demande"
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
