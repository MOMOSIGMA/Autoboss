import { useState } from 'react';
import { supabase } from "../config/supabase";

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
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('requests').insert({
      name: formData.name,
      contact: formData.contact,
      car_type: formData.car_type,
      marque: formData.marque || null,
      modele: formData.modele || null,
      budget: formData.budget ? parseInt(formData.budget) : null,
      details: formData.details || null,
      notifications: formData.notifications,
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      setSuccessMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    } else {
      setSuccessMessage('Demande envoyée avec succès ! Nous vous contacterons bientôt.');
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
    }
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="container mx-auto p-4 pt-4">
      <h2 className="text-xl font-bold text-gold mb-4">Faites une Demande Spécifique</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gold max-w-md mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Votre nom"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          placeholder="Email ou téléphone"
          value={formData.contact}
          onChange={e => setFormData({ ...formData, contact: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <select
          value={formData.car_type}
          onChange={e => setFormData({ ...formData, car_type: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="Achat">Achat</option>
          <option value="Location">Location</option>
        </select>
        <input
          type="text"
          placeholder="Marque (ex: Toyota)"
          value={formData.marque}
          onChange={e => setFormData({ ...formData, marque: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Modèle (ex: Corolla)"
          value={formData.modele}
          onChange={e => setFormData({ ...formData, modele: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Budget (en FCFA)"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <textarea
          placeholder="Détails supplémentaires (ex: couleur, année)"
          value={formData.details}
          onChange={e => setFormData({ ...formData, details: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows="4"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.notifications}
            onChange={e => setFormData({ ...formData, notifications: e.target.checked })}
            className="mr-2"
          />
          <span className="text-white">Recevoir des notifications</span>
        </div>
        <button type="submit" className="w-full bg-gold text-black p-2 rounded hover:bg-yellow-400 transition">
          Envoyer la Demande
        </button>
        {successMessage && <p className="text-white mt-4 text-center">{successMessage}</p>}
      </form>
    </div>
  );
}

export default ContactForm;