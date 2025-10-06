import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Categories = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All Plans');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Plans']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map((service: any) => ({
        id: service.id,
        name: service.name,
        price: Number(service.price),
        image: service.image_url || '/placeholder.svg',
        description: service.description || '',
        category: service.category,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('name')
        .eq('is_active', true);

      if (error) throw error;

      const categoryNames = ['All Plans', ...(data || []).map((cat: any) => cat.name)];
      setCategories(categoryNames);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Plans' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All Plans') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl font-heading font-bold">
            Product <span className="gradient-text">Categories</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="premium-card sticky top-8">
              <h2 className="font-heading font-bold text-lg mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedCategory === category
                        ? 'bg-accent text-white shadow-lg'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm opacity-70">
                        {getCategoryCount(category)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Category Stats */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{categories.length - 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Showing:</span>
                    <span className="font-medium">{filteredProducts.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold">
                  {selectedCategory}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <Button
                  variant={viewMode === 'grid' ? 'premium' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'premium' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? `No products found for "${searchQuery}"` : 'No products found in this category.'}
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={viewMode === 'list' ? 'flex gap-4 premium-card p-4' : ''}>
                    {viewMode === 'list' ? (
                      <>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">${product.price}</span>
                            <Button variant="buy" size="sm" onClick={() => handleViewProduct(product)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <ProductCard
                        product={product}
                        onViewProduct={handleViewProduct}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;