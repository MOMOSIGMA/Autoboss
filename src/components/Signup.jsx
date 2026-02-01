// src/components/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Veuillez entrer votre nom complet');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      // Insérer le profil avec full_name
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: `User_${data.user.id.slice(0, 8)}`,
        full_name: fullName,
      });
      if (profileError) {
        toast.error('Erreur lors de la création du profil: ' + profileError.message);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        toast.success('Inscription réussie ! Redirection...');
        setTimeout(() => navigate('/'), 2000);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 mt-20 bg-gray-900 text-white min-h-screen" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Inscription</h2>
      <form onSubmit={handleSignup} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-1">Nom complet</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Signup;