import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductGridProps {
  onViewProduct: (product: Product) => void;
}

const ProductGrid = ({ onViewProduct }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Products']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
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
      const { data, error } = await (supabase as any)
        .from('service_categories')
        .select('name')
        .eq('is_active', true);

      if (error) throw error;

      const categoryNames = ['All Products', ...(data || []).map((cat: any) => cat.name)];
      setCategories(categoryNames);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All Products' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Featured <span className="gradient-text">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of premium services, 
            all available with secure cryptocurrency payments.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between animate-fade-in">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Filter by:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'premium' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs hover:scale-105"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 hover:border-accent smooth-transition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {sortedProducts.map((product, index) => (
              <div 
                key={product.id} 
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <ProductCard
                  product={product}
                  onViewProduct={onViewProduct}
                />
              </div>
            ))}
          </div>
        )}

        {/* Show more products message */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/30 flex items-center justify-center">
              <Filter className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground font-medium">No products found in this category.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedCategory('All Products')}
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;