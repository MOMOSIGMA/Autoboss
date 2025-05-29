import { useState, useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // Disparaît après 5 secondes
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  );
}

export default Toast;