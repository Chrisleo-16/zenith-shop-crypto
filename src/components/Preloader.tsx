import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation over 6 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.67; // 100/60 = ~1.67 per 100ms for 6 seconds
      });
    }, 100);

    // Hide preloader after 6 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-midnight via-dark-purple to-midnight">
      <div className="text-center space-y-8 px-6 max-w-md w-full">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer glow rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-neon-purple opacity-20 animate-pulse-glow"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-neon-purple opacity-30 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Main icon container */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-accent via-neon-purple to-accent shadow-elegant flex items-center justify-center">
              <Shield className="w-12 h-12 text-white animate-pulse" />
            </div>
            
            {/* Beam effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
          </div>
        </div>

        {/* Brand name */}
        <div>
          <h2 className="text-3xl font-heading font-bold gradient-text mb-2 animate-fade-in">
            Proxy-Purchase
          </h2>
          <p className="text-white/70 text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Loading your secure experience...
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Progress 
            value={progress} 
            className="h-2 bg-white/10 backdrop-blur-sm"
          />
          <p className="text-xs text-white/50 font-mono">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
