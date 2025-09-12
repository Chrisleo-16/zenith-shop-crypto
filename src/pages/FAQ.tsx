import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData = [
    {
      id: 'payments',
      category: 'Payments',
      questions: [
        {
          id: 'crypto-payments',
          question: 'How do cryptocurrency payments work?',
          answer: 'Simply select crypto payment at checkout, choose your preferred cryptocurrency (Bitcoin or Ethereum), and send the exact amount to our wallet address. Transactions are typically confirmed within 10-30 minutes.'
        },
        {
          id: 'payment-security',
          question: 'Are crypto payments secure?',
          answer: 'Yes! All cryptocurrency transactions are secured by blockchain technology with military-grade encryption. We never store your private keys or wallet information.'
        },
        {
          id: 'traditional-payments',
          question: 'What traditional payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.'
        },
        {
          id: 'payment-processing',
          question: 'How long does payment processing take?',
          answer: 'Credit card payments are processed instantly. Cryptocurrency payments take 10-30 minutes for confirmation. Bank transfers may take 1-3 business days.'
        }
      ]
    },
    {
      id: 'orders',
      category: 'Orders & Shipping',
      questions: [
        {
          id: 'order-tracking',
          question: 'How can I track my order?',
          answer: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also check your order status in your account dashboard.'
        },
        {
          id: 'shipping-time',
          question: 'What are the shipping times?',
          answer: 'Standard shipping takes 3-7 business days, Express shipping takes 1-3 business days, and Overnight shipping arrives the next business day.'
        },
        {
          id: 'international-shipping',
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically 7-14 business days.'
        },
        {
          id: 'order-modification',
          question: 'Can I modify or cancel my order?',
          answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team for assistance.'
        }
      ]
    },
    {
      id: 'returns',
      category: 'Returns & Refunds',
      questions: [
        {
          id: 'return-policy',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused items in original packaging. Electronics have a 14-day return window. Custom items are non-returnable.'
        },
        {
          id: 'refund-methods',
          question: 'How will I receive my refund?',
          answer: 'Refunds are processed using the original payment method. Crypto refunds are converted to USD and sent to your preferred method.'
        },
        {
          id: 'return-shipping',
          question: 'Who pays for return shipping?',
          answer: 'We provide free return shipping for defective items. Customer-initiated returns require customer to cover return shipping costs.'
        }
      ]
    },
    {
      id: 'account',
      category: 'Account & Security',
      questions: [
        {
          id: 'create-account',
          question: 'Do I need an account to shop?',
          answer: 'You can checkout as a guest, but creating an account allows you to track orders, save payment methods, and access exclusive offers.'
        },
        {
          id: 'password-reset',
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a password reset link within minutes.'
        },
        {
          id: 'data-security',
          question: 'How is my personal data protected?',
          answer: 'We use SSL encryption for all data transmission and comply with GDPR and CCPA regulations. Your data is never shared with third parties.'
        }
      ]
    },
    {
      id: 'technical',
      category: 'Technical Support',
      questions: [
        {
          id: 'browser-issues',
          question: 'The website isn\'t working properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or use an incognito/private browsing window. Make sure your browser is up to date.'
        },
        {
          id: 'mobile-app',
          question: 'Do you have a mobile app?',
          answer: 'Our website is fully optimized for mobile devices. A dedicated mobile app is coming soon with exclusive features.'
        },
        {
          id: 'system-requirements',
          question: 'What are the system requirements?',
          answer: 'Our platform works on all modern browsers (Chrome, Firefox, Safari, Edge) and requires an internet connection. No special software needed.'
        }
      ]
    }
  ];

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl font-heading font-bold">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            How Can We Help You?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products, payments, and services.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category) => (
            <div key={category.id} className="premium-card">
              <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-electric-blue flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq) => (
                  <Collapsible key={faq.id}>
                    <CollapsibleTrigger
                      onClick={() => toggleItem(faq.id)}
                      className="flex items-center justify-between w-full p-4 text-left bg-secondary/20 rounded-xl hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      {openItems.includes(faq.id) ? (
                        <Minus className="w-4 h-4 text-accent" />
                      ) : (
                        <Plus className="w-4 h-4 text-accent" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center premium-card">
          <h3 className="text-2xl font-heading font-bold mb-4">
            Still Need Help?
          </h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;