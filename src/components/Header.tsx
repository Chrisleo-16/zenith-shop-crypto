import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartUtils } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartUtils();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-accent to-neon-purple shadow-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold gradient-text">
                CryptoShop
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Premium • Modern • Crypto
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 rounded-xl border-border/40 bg-background/50 backdrop-blur"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="text-sm font-medium text-foreground hover:text-accent smooth-transition">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium text-foreground hover:text-accent smooth-transition">
              Categories
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-accent smooth-transition">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-4 h-4" />
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-4 h-4" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs text-white flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 rounded-xl border-border/40"
                />
              </div>
              <nav className="space-y-2">
                <Link to="/categories" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2">
                  Products
                </Link>
                <Link to="/categories" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2">
                  Categories
                </Link>
                <Link to="/about" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2">
                  About
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;