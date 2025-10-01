import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-midnight via-dark-purple to-midnight">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-neon-purple border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-accent" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold gradient-text mb-2">
            SecureVPN Pro
          </h2>
          <p className="text-white/70 text-sm">Loading your secure experience...</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
