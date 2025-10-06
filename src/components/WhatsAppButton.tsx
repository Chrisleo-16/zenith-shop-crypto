import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  // Admin should update this number in the component or add it to system settings
  const phoneNumber = '1234567890'; // Replace with actual WhatsApp business number (without +)
  const defaultMessage = 'Hello! I have a question about your Proxy-Purchase services.';
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BD5A] hover:scale-110 smooth-transition z-50"
      size="icon"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </Button>
  );
};

export default WhatsAppButton;
