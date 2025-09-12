import { Product } from '@/contexts/CartContext';
import productTech from '@/assets/product-tech.jpg';
import productFashion from '@/assets/product-fashion.jpg';
import productHome from '@/assets/product-home.jpg';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Earbuds',
    price: 299.99,
    image: productTech,
    description: 'High-quality wireless earbuds with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 399.99,
    image: productTech,
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Your perfect workout companion.',
    category: 'Technology',
  },
  {
    id: '3',
    name: 'Designer Sunglasses',
    price: 199.99,
    image: productFashion,
    description: 'Luxury designer sunglasses with UV protection and premium materials. Style meets functionality.',
    category: 'Fashion',
  },
  {
    id: '4',
    name: 'Leather Premium Wallet',
    price: 89.99,
    image: productFashion,
    description: 'Handcrafted genuine leather wallet with RFID protection and multiple card slots. Timeless elegance.',
    category: 'Fashion',
  },
  {
    id: '5',
    name: 'Minimalist Desk Lamp',
    price: 129.99,
    image: productHome,
    description: 'Modern LED desk lamp with adjustable brightness and wireless charging base. Perfect for any workspace.',
    category: 'Home & Lifestyle',
  },
  {
    id: '6',
    name: 'Ceramic Plant Pot Set',
    price: 49.99,
    image: productHome,
    description: 'Beautiful ceramic plant pots in various sizes. Bring nature into your home with style.',
    category: 'Home & Lifestyle',
  },
  {
    id: '7',
    name: 'Smartphone Pro Max',
    price: 1199.99,
    image: productTech,
    description: 'Latest flagship smartphone with advanced camera system, 5G connectivity, and all-day battery life.',
    category: 'Technology',
  },
  {
    id: '8',
    name: 'Luxury Watch Collection',
    price: 899.99,
    image: productFashion,
    description: 'Swiss-made luxury watch with automatic movement and sapphire crystal. A true statement piece.',
    category: 'Fashion',
  },
];

export const categories = [
  'All Products',
  'Technology',
  'Fashion',
  'Home & Lifestyle',
];