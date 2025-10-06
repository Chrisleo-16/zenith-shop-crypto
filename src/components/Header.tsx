import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Store, User, Shield, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartUtils } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems, toggleCart } = useCartUtils();
  const { user, isAdmin, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/categories?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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
                Proxy-Purchase
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Premium • Modern • Crypto
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 rounded-xl border-border/40 bg-background/50 backdrop-blur"
              />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:bg-transparent">
                    VPN
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/95 backdrop-blur border border-border/40">
                    <div className="w-48 p-2">
                      <Link to="/categories?category=Daily Plans" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Daily Plans
                      </Link>
                      <Link to="/categories?category=Weekly Plans" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Weekly Plans
                      </Link>
                      <Link to="/categories?category=Monthly Plans" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Monthly Plans
                      </Link>
                      <Link to="/categories?category=Annual Plans" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Annual Plans
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:bg-transparent">
                    Proxy
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/95 backdrop-blur border border-border/40">
                    <div className="w-48 p-2">
                      <Link to="/categories?category=Proxy Services" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Premium Proxies
                      </Link>
                      <Link to="/categories?category=Enterprise Plans" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Enterprise Proxies
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:bg-transparent">
                    Fullz
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background/95 backdrop-blur border border-border/40">
                    <div className="w-48 p-2">
                      <Link to="/categories?category=Fullz" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Premium Fullz
                      </Link>
                      <Link to="/categories?category=Fullz" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
                        Business Fullz
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/others" className="text-sm font-medium text-foreground hover:text-accent smooth-transition inline-flex items-center h-10 px-4 py-2">
                    Others
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-accent smooth-transition">
                Dashboard
              </Link>
            )}
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-accent smooth-transition">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link to="/auth">
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Link>
              </Button>
            )}

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

            {/* Mobile Menu Toggle */}
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
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 rounded-xl border-border/40"
                />
              </form>

              {/* Navigation */}
              <nav className="space-y-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">VPN</p>
                  <Link to="/categories?category=Daily Plans" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2 pl-4">
                    Daily Plans
                  </Link>
                  <Link to="/categories?category=Monthly Plans" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2 pl-4">
                    Monthly Plans
                  </Link>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">Proxy</p>
                  <Link to="/categories?category=Proxy Services" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2 pl-4">
                    Premium Proxies
                  </Link>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">Others</p>
                  <Link to="/others" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2 pl-4">
                    Accounts & More
                  </Link>
                </div>
                {user && (
                  <Link to="/dashboard" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2 border-t border-border/40 mt-2 pt-4">
                    Dashboard
                  </Link>
                )}
                <Link to="/about" className="block text-sm font-medium text-foreground hover:text-accent smooth-transition py-2">
                  About
                </Link>
              </nav>

              {/* Auth Buttons - Mobile */}
              <div className="pt-4 border-t border-border/40 space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                        <Link to="/admin">
                          <Shield className="w-4 h-4 mr-1" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link to="/auth">
                      <User className="w-4 h-4 mr-1" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
