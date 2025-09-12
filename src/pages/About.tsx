import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Users, Globe, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl font-heading font-bold">
            About <span className="gradient-text">CryptoShop</span>
          </h1>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-heading font-bold mb-6">
            Revolutionizing E-commerce with 
            <span className="block gradient-text">Cryptocurrency Payments</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the future of online shopping where premium quality meets cutting-edge technology. 
            Experience seamless transactions with both traditional and cryptocurrency payments.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="premium-card">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To democratize premium online shopping by bridging traditional e-commerce with the 
                revolutionary world of cryptocurrency. We believe everyone should have access to 
                high-quality products through secure, modern payment methods.
              </p>
            </div>

            <div className="premium-card">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-accent flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's leading cryptocurrency-enabled e-commerce platform, 
                setting new standards for security, user experience, and product quality 
                while fostering global digital economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center premium-card">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Security First</h3>
              <p className="text-muted-foreground">
                We implement military-grade security measures to protect your data and transactions, 
                ensuring every purchase is safe and secure.
              </p>
            </div>

            <div className="text-center premium-card">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-accent flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every product in our catalog is carefully curated to meet the highest standards 
                of quality, design, and functionality.
              </p>
            </div>

            <div className="text-center premium-card">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">Customer Obsessed</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We're constantly improving our platform 
                based on customer feedback and emerging needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Passionate innovators building the future of commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Founder",
                bio: "Former crypto enthusiast with 10+ years in e-commerce and blockchain technology."
              },
              {
                name: "Sarah Rodriguez",
                role: "CTO",
                bio: "Security expert and full-stack developer passionate about creating seamless user experiences."
              },
              {
                name: "Marcus Johnson",
                role: "Head of Product",
                bio: "Design-focused product leader with expertise in fintech and user experience optimization."
              }
            ].map((member, index) => (
              <div key={index} className="text-center premium-card">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent to-neon-purple flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{member.name}</h3>
                <p className="text-accent font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-midnight to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have already made the switch to modern, 
            secure, and innovative online shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate('/')}>
              Start Shopping
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;