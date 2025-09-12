import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl font-heading font-bold">
            Contact <span className="gradient-text">Us</span>
          </h1>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            We're Here to Help
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products, payments, or services? 
            Our team is ready to assist you with anything you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="premium-card">
              <h3 className="font-heading font-bold text-lg mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@cryptoshop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Crypto Street<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 9AM-6PM PST<br />
                      Sat-Sun: 10AM-4PM PST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card">
              <h3 className="font-heading font-bold text-lg mb-4">Quick Support</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/faq')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Visit FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="premium-card">
              <h3 className="font-heading font-bold text-xl mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency Payments</SelectItem>
                      <SelectItem value="returns">Returns & Refunds</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    placeholder="Please provide as much detail as possible..."
                    required 
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="newsletter" className="rounded" />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to our newsletter for updates and exclusive offers
                  </Label>
                </div>

                <Button type="submit" variant="buy" className="w-full group">
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center premium-card">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold mb-2">Live Chat</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get instant help with our live chat support during business hours.
            </p>
            <Button variant="outline" size="sm">Start Chat</Button>
          </div>

          <div className="text-center premium-card">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-accent flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold mb-2">Phone Support</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Speak directly with our support team for complex issues.
            </p>
            <Button variant="outline" size="sm">Call Now</Button>
          </div>

          <div className="text-center premium-card">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold mb-2">Email Support</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Send detailed inquiries and receive comprehensive responses.
            </p>
            <Button variant="outline" size="sm">Send Email</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;