import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import { Product } from '@/contexts/CartContext';

const Index = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductGrid onViewProduct={handleViewProduct} />
      <Cart />
      
      {/* Footer */}
      <footer className="bg-gradient-to-b from-midnight to-black text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-heading font-bold gradient-text mb-3">Proxy-Purchase</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted provider for premium VPN, proxy services, and secure solutions worldwide.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Services</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link to="/categories?category=VPN" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">VPN Solutions</Link></li>
                <li><Link to="/categories?category=Proxy Services" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">Proxy Services</Link></li>
                <li><Link to="/categories?category=Fullz" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">Fullz Packages</Link></li>
                <li><Link to="/others" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">Other Services</Link></li>
              </ul>
            </div>

            {/* Payment */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Payment Methods</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Bitcoin (BTC)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-purple"></span>
                  Ethereum (ETH)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-electric-blue"></span>
                  USDT & More
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link to="/faq" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link to="/about" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-accent smooth-transition hover:translate-x-1 inline-block">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50 text-center md:text-left">
              © {new Date().getFullYear()} Proxy-Purchase. All rights reserved. Built with 🔒 by <a href="https://github.com/Chrisleo-16/" className="hover:text-accent smooth-transition"><u>Leo Chrisben</u></a>
            </p>
            <p className="text-xs text-white/40">
              Privacy • Security • Freedom
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
