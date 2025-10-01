import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartUtils } from '@/contexts/CartContext';
import { Product } from '@/contexts/CartContext';

const othersProducts: Product[] = [
  {
    id: 'other-1',
    name: 'Netflix Premium Account',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500',
    description: '1-month Netflix Premium account with 4K streaming and 4 screens.',
    category: 'Streaming Accounts',
  },
  {
    id: 'other-2',
    name: 'Spotify Premium Account',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500',
    description: '1-month Spotify Premium with ad-free music and offline downloads.',
    category: 'Streaming Accounts',
  },
  {
    id: 'other-3',
    name: 'Disney+ Premium Account',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500',
    description: '1-month Disney+ Premium with all Marvel, Star Wars, and Disney content.',
    category: 'Streaming Accounts',
  },
  {
    id: 'other-4',
    name: 'Grammarly Premium',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500',
    description: '1-month Grammarly Premium for professional writing assistance.',
    category: 'Writing Tools',
  },
  {
    id: 'other-5',
    name: 'Canva Pro Account',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=500',
    description: '1-month Canva Pro with premium templates and design tools.',
    category: 'Design Tools',
  },
  {
    id: 'other-6',
    name: 'ChatGPT Plus',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
    description: '1-month ChatGPT Plus with GPT-4 access and priority support.',
    category: 'AI Tools',
  },
];

const categories = ['All', 'Streaming Accounts', 'Writing Tools', 'Design Tools', 'AI Tools'];

const Others = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addItem } = useCartUtils();

  const filteredProducts = selectedCategory === 'All'
    ? othersProducts
    : othersProducts.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-midnight via-dark-purple to-midnight">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">
              Premium Accounts & Services
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Get access to premium streaming accounts, writing tools, and more at unbeatable prices.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border/40 bg-card/50 backdrop-blur">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-accent text-white">
                    {product.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent">${product.price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    variant="buy"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Others;
