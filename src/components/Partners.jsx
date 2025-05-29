import { useState, useEffect } from 'react';
import { supabase } from "../config/supabase";

function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase.from('partners').select('*');
      if (error) console.error(error);
      else setPartners(data);
    };
    fetchPartners();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold text-gold mb-4">Nos Partenaires</h2>
      <div className="grid grid-cols-6 gap-4 max-h-16 overflow-hidden">
        {partners.map((partner, index) => (
          <div key={partner.id} className="flex flex-col items-center">
            {partner.logo && (
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-8 h-8 object-contain rounded-lg mb-2"
                loading="lazy"
              />
            )}
            <p className="text-white text-center text-xs">{partner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Partners;