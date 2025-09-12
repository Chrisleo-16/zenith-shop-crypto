import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Coins, Copy, Check, Wallet, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartUtils } from '@/contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [copied, setCopied] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartUtils();

  // Mock crypto wallet addresses
  const walletAddresses = {
    bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ethereum: '0x742d35Cc6635C0532925a3b8D238959d8E54ea24',
  };

  const total = getTotalPrice();

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentComplete = () => {
    clearCart();
    navigate('/');
    // Here you would typically integrate with actual payment processing
    alert('Payment completed! Thank you for your purchase.');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to checkout</p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-heading font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="premium-card">
              <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-secondary/20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Total Amount:</span>
                  <div className="text-right">
                    <div className="font-bold text-2xl">${total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      ≈ {(total / 30000).toFixed(6)} BTC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <div className="premium-card">
              <h2 className="text-xl font-heading font-bold mb-6">Payment Details</h2>

              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Cryptocurrency
                  </TabsTrigger>
                </TabsList>

                {/* Credit Card Payment */}
                <TabsContent value="card">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <Button 
                      variant="buy" 
                      className="w-full mt-6"
                      onClick={handlePaymentComplete}
                    >
                      Complete Payment - ${total.toFixed(2)}
                    </Button>
                  </div>
                </TabsContent>

                {/* Crypto Payment */}
                <TabsContent value="crypto">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Choose Your Cryptocurrency</h3>
                      <p className="text-sm text-muted-foreground">
                        Send the exact amount to the wallet address below
                      </p>
                    </div>

                    {/* Bitcoin Payment */}
                    <div className="premium-card">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                          <Coins className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Bitcoin (BTC)</h4>
                          <p className="text-sm text-muted-foreground">
                            Amount: {(total / 30000).toFixed(6)} BTC
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Wallet Address</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={walletAddresses.bitcoin} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopyAddress(walletAddresses.bitcoin)}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Ethereum Payment */}
                    <div className="premium-card">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Ethereum (ETH)</h4>
                          <p className="text-sm text-muted-foreground">
                            Amount: {(total / 2000).toFixed(4)} ETH
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Wallet Address</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={walletAddresses.ethereum} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopyAddress(walletAddresses.ethereum)}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                      <h4 className="font-semibold text-accent mb-2">Important Notes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Send the exact amount to avoid processing delays</li>
                        <li>• Payment confirmation may take 10-30 minutes</li>
                        <li>• Do not send any other cryptocurrency to these addresses</li>
                        <li>• Contact support if you have any issues</li>
                      </ul>
                    </div>

                    <Button 
                      variant="crypto" 
                      className="w-full"
                      onClick={handlePaymentComplete}
                    >
                      I've Sent the Payment
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;