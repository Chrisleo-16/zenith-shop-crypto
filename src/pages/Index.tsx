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
      <footer className="bg-midnight text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-heading font-bold gradient-text mb-2">CryptoShop</h3>
            <p className="text-white/70">Premium • Modern • Crypto</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/about" className="hover:text-accent smooth-transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-accent smooth-transition">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-accent smooth-transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Payment Methods</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Bitcoin (BTC)</li>
                <li>Ethereum (ETH)</li>
                <li>Credit Cards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/faq" className="hover:text-accent smooth-transition">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-accent smooth-transition">Shipping Info</Link></li>
                <li><Link to="/contact" className="hover:text-accent smooth-transition">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} CryptoShop. All rights reserved. Built by <a href="https://github.com/Chrisleo-16/"> <u>Leo Chrisben</u> </a> for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
