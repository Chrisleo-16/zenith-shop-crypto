import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, CreditCard, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartUtils } from '@/contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    clearCart 
  } = useCartUtils();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shopping Cart
            </h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>≈ BTC</span>
                  <span>{(getTotalPrice() / 30000).toFixed(6)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="buy" 
                  className="w-full group"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
                <Button 
                  variant="crypto" 
                  className="w-full group"
                  onClick={handleCheckout}
                >
                  <Coins className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Pay with Crypto
                </Button>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-xs"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;