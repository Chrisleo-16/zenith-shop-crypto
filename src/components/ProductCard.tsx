import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/contexts/CartContext';
import { useCartUtils } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

const ProductCard = ({ product, onViewProduct }: ProductCardProps) => {
  const { addItem } = useCartUtils();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="group premium-card overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md bg-white/90 hover:bg-white"
            onClick={() => onViewProduct(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md bg-white/90 hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-background/90 backdrop-blur-md rounded-full text-foreground">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          <span className="text-sm text-muted-foreground">
            ≈ {(product.price / 30000).toFixed(4)} BTC
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="buy" 
          className="w-full group/btn"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;