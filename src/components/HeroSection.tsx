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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <Zap className="w-4 h-4 mr-2 text-electric-blue" />
            <span className="text-sm font-medium">Now Accepting Cryptocurrency Payments</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
              Online Shopping
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Premium products, modern design, and seamless crypto payments. 
            Experience shopping reimagined for the digital age.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="group">
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="premium-card bg-white/5 backdrop-blur-md border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">Crypto Payments</h3>
              <p className="text-sm text-white/70">
                Accept Bitcoin, Ethereum, and other cryptocurrencies
              </p>
            </div>

            <div className="premium-card bg-white/5 backdrop-blur-md border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-neon-purple to-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">Secure & Fast</h3>
              <p className="text-sm text-white/70">
                Military-grade security with lightning-fast checkouts
              </p>
            </div>

            <div className="premium-card bg-white/5 backdrop-blur-md border-white/10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-white/70">
                Curated selection of high-quality products
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