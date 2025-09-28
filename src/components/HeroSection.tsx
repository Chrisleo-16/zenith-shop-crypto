import { ArrowRight, Zap, Shield, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern e-commerce platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 mt-3">
            <Shield className="w-4 h-4 mr-2 text-electric-blue" />
            <span className="text-sm font-medium">100% Anonymous • Crypto-Friendly Payments</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Premium VPN &
            <span className="block bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
              Proxy Solutions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and unrestricted internet access for individuals and businesses. 
            Stay anonymous, safe, and free online with affordable crypto-friendly plans.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="group">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white bg-transparent hover:bg-white/10">
              View Plans
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-2">
            <div className="premium-card bg-white/5 backdrop-blur-md border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">100% Connectivity</h3>
              <p className="text-sm text-white/70">
                Fast, stable, and uninterrupted browsing, streaming, and downloading
              </p>
            </div>

            <div className="premium-card bg-transparent backdrop-blur-sm border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-neon-purple to-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">Advanced Security</h3>
              <p className="text-sm text-white/70">
                State-of-the-art encryption to protect your identity and data
              </p>
            </div>

            <div className="premium-card bg-white/5 backdrop-blur-md border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">Crypto-Friendly</h3>
              <p className="text-sm text-white/70">
                Pay securely and anonymously with cryptocurrency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-neon-purple to-accent rounded-full opacity-20 animate-pulse" />
    </section>
  );
};

export default HeroSection;