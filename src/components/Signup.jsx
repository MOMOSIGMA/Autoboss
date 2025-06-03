import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      // Vérifier la session après l'inscription
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      toast.success('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/'), 2000); // Redirige après 2 secondes
    }
  };

  return (
    <div className="container mx-auto p-4 pt-4 text-white">
      <h2 className="text-xl font-bold text-gold mb-4">Inscription</h2>
      <form onSubmit={handleSignup} className="max-w-md">
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
          className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Signup;