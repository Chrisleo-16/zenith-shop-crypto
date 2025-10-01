import { Product } from '@/contexts/CartContext';
import productTech from '@/assets/product-tech.jpg';
import productFashion from '@/assets/product-fashion.jpg';
import productHome from '@/assets/product-home.jpg';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Daily VPN Access',
    price: 2.99,
    image: productTech,
    description: 'Perfect for short-term projects. 24-hour premium VPN access with global servers and unlimited bandwidth.',
    category: 'Daily Plans',
  },
  {
    id: '2',
    name: 'Weekly VPN Pro',
    price: 9.99,
    image: productTech,
    description: '7-day premium VPN access with advanced security features, streaming optimization, and 24/7 support.',
    category: 'Weekly Plans',
  },
  {
    id: '3',
    name: 'Monthly VPN Premium',
    price: 19.99,
    image: productFashion,
    description: '30-day premium VPN with unlimited devices, dedicated IP option, and priority customer support.',
    category: 'Monthly Plans',
  },
  {
    id: '4',
    name: 'Quarterly VPN Business',
    price: 49.99,
    image: productFashion,
    description: '3-month business-grade VPN solution with team management, advanced analytics, and enterprise support.',
    category: 'Quarterly Plans',
  },
  {
    id: '5',
    name: 'Annual VPN Ultimate',
    price: 99.99,
    image: productHome,
    description: '12-month ultimate VPN package with all premium features, dedicated servers, and maximum savings.',
    category: 'Annual Plans',
  },
  {
    id: '6',
    name: 'Premium Proxy Package',
    price: 29.99,
    image: productHome,
    description: 'High-speed proxy service with rotating IPs, global locations, and 99.9% uptime guarantee.',
    category: 'Proxy Services',
  },
  {
    id: '7',
    name: 'Enterprise VPN Solution',
    price: 199.99,
    image: productTech,
    description: 'Complete enterprise VPN solution with custom deployment, dedicated account manager, and SLA.',
    category: 'Enterprise Plans',
  },
  {
    id: '8',
    name: 'VPN + Proxy Combo',
    price: 39.99,
    image: productFashion,
    description: 'Best value package combining premium VPN and proxy services with additional security features.',
    category: 'Combo Plans',
  },
  {
    id: '9',
    name: 'Premium Fullz - US',
    price: 89.99,
    image: productTech,
    description: 'Complete personal information package with verified details for US citizens.',
    category: 'Fullz',
  },
  {
    id: '10',
    name: 'Business Fullz - CA',
    price: 129.99,
    image: productFashion,
    description: 'Comprehensive business information package for Canadian entities with full documentation.',
    category: 'Fullz',
  },
];

export const categories = [
  'All Plans',
  'Daily Plans',
  'Weekly Plans',
  'Monthly Plans',
  'Quarterly Plans',
  'Annual Plans',
  'Proxy Services',
  'Enterprise Plans',
  'Combo Plans',
  'Fullz',
];