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
    <div className="group premium-card overflow-hidden hover:scale-[1.02] smooth-transition animate-fade-in">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-secondary/20">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-2 pb-4">
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md bg-white/95 hover:bg-white text-midnight hover:scale-110"
            onClick={() => onViewProduct(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md bg-white/95 hover:bg-white text-midnight hover:scale-110"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-accent/90 to-neon-purple/90 backdrop-blur-md rounded-full text-white shadow-lg">
            {product.category}
          </span>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div>
            <span className="text-2xl font-bold text-foreground gradient-text">
              ${product.price}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              ≈ {(product.price / 30000).toFixed(4)} BTC
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="buy" 
          className="w-full group/btn"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:rotate-12 smooth-transition" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;