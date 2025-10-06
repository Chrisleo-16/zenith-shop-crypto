import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today? You can ask me about our products, payment methods, or shipping policies.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickReplies = [
    'Show me VPN plans',
    'Payment methods?',
    'How to buy?',
    'Talk to support',
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Bot response logic
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const getBotResponse = (input: string): string => {
    if (input.includes('vpn') || input.includes('plan')) {
      return 'We offer Daily, Weekly, Monthly, and Annual VPN plans. Each plan comes with unlimited bandwidth and military-grade encryption. Would you like to see our pricing?';
    } else if (input.includes('payment') || input.includes('crypto')) {
      return 'We accept various cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and USDT. All payments are processed securely and anonymously.';
    } else if (input.includes('buy') || input.includes('purchase')) {
      return 'To make a purchase: 1) Browse our products, 2) Add items to cart, 3) Proceed to checkout, 4) Select your payment method (card or crypto), 5) Complete payment. It\'s that simple!';
    } else if (input.includes('support') || input.includes('help') || input.includes('talk')) {
      return 'I can connect you with our support team via WhatsApp for personalized assistance. Would you like me to redirect you?';
    } else if (input.includes('proxy')) {
      return 'Our proxy services include Premium Proxies and Enterprise Proxies with dedicated IPs, high-speed connections, and 24/7 uptime. What would you like to know more about?';
    } else if (input.includes('shipping') || input.includes('delivery')) {
      return 'Since we provide digital services, there\'s no physical shipping. You\'ll receive your access credentials via email immediately after payment confirmation!';
    } else {
      return 'I\'m here to help! You can ask me about our VPN plans, proxy services, payment methods, or how to make a purchase. Or type "support" to chat with our team directly.';
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-accent to-neon-purple hover:scale-110 smooth-transition z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 px-6 rounded-full shadow-2xl bg-gradient-to-r from-accent to-neon-purple hover:scale-105 smooth-transition flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Chat Assistant</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] premium-card shadow-2xl z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-accent/10 to-neon-purple/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-neon-purple flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Chat Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-accent to-neon-purple text-white'
                    : 'bg-secondary/50 text-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Replies */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(reply)}
              className="text-xs"
            >
              {reply}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-accent to-neon-purple"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
