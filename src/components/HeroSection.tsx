"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Shield,
  Coins,
  Globe,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

/* Products sample data */
const productsData = [
  { id: 1, name: "Basic VPN Plan", price: "$5/mo", desc: "Fast & secure browsing" },
  { id: 2, name: "Pro VPN Plan", price: "$10/mo", desc: "Streaming & unlimited bandwidth" },
  { id: 3, name: "Business Proxy", price: "$20/mo", desc: "Team-ready proxy & controls" },
  { id: 4, name: "Dedicated IP", price: "$15/mo", desc: "Unique IP for control & access" },
  { id: 5, name: "Ultimate Bundle", price: "$30/mo", desc: "All features + priority support" },
];

/* Animation Variants (type-safe) */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for safety
    },
  },
};

const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

/* Trusted Logo card */
const TrustedLogo = ({ name }: { name: string }) => (
  <motion.div
    variants={fadeUp}
    className="flex items-center justify-center bg-white/5 border border-white/6 rounded-xl px-6 py-4 max-w-[160px]"
  >
    <div className="w-10 h-10 rounded-md bg-white/8 mr-3 flex items-center justify-center">
      <span className="font-semibold text-sm text-white/80">{name[0]}</span>
    </div>
    <div className="text-left">
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-white/60">Verified</div>
    </div>
  </motion.div>
);

const HeroSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(productsData.length / itemsPerPage);
  const currentProducts = productsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full font-sans antialiased text-white">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="VPN and Proxy services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-midnight/75 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center text-white"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 mb-8 mt-4"
            >
              <Shield className="w-4 h-4 mr-2 text-electric-blue" />
              <span className="text-sm font-medium">
                100% Anonymous • Crypto-Friendly Payments
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight"
            >
              Premium VPN &amp;
              <span className="block bg-gradient-to-r from-electric-blue to-neon-purple bg-clip-text text-transparent">
                Proxy Solutions
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Fast, secure, and unrestricted internet access for individuals and
              businesses. Stay anonymous, safe, and free online with transparent
              pricing and crypto-friendly checkout.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button variant="hero" size="lg" className="group inline-flex items-center">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white bg-transparent hover:bg-white/6"
              >
                View Plans
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={staggerParent}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                {
                  icon: <Zap className="w-6 h-6 text-white" />,
                  title: "100% Connectivity",
                  text: "Fast, stable, and uninterrupted streaming and browsing.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  title: "Advanced Security",
                  text: "Military-grade encryption & strict no-logs policy.",
                },
                {
                  icon: <Coins className="w-6 h-6 text-white" />,
                  title: "Crypto-Friendly",
                  text: "Pay with BTC/ETH/USDT and remain pseudonymous.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="premium-card bg-white/5 backdrop-blur-md border-white/8 p-6 rounded-2xl text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT US ================= */}
      <section className="relative py-24 bg-gradient-to-b from-midnight to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-heading font-bold mb-6"
            >
              About <span className="text-electric-blue">Us</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-white/80 leading-relaxed mb-12"
            >
              At <strong>[Your Site Name]</strong>, we’re more than just a VPN &
              proxy provider. We are a team of tech enthusiasts, cybersecurity
              experts, and privacy advocates committed to making the internet
              safer, freer, and more accessible for everyone.
              <br />
              <br />
              Whether you’re a student, professional, or business owner, our
              mission is simple: to keep you secure, anonymous, and unrestricted
              online.
            </motion.p>

            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
            >
              {[
                {
                  icon: <Globe className="w-8 h-8 text-electric-blue" />,
                  title: "Worldwide Access",
                  text: "Servers across continents so you’re always connected.",
                },
                {
                  icon: <Users className="w-8 h-8 text-neon-purple" />,
                  title: "Community Driven",
                  text: "Built with user trust & constant feedback.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-green-400" />,
                  title: "Scalable Solutions",
                  text: "Flexible for personal or enterprise security needs.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= TRUSTED BY ================= */}
      <section className="py-16 bg-midnight/90">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-heading font-bold mb-10"
          >
            Trusted By <span className="text-electric-blue">Businesses</span> &
            Professionals
          </motion.h2>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {["TechCorp", "FinEdge", "EduNet", "TravelX", "DataGuard"].map(
              (logo, i) => (
                <TrustedLogo key={i} name={logo} />
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold mb-12"
          >
            Our <span className="text-neon-purple">Plans</span> & Pricing
          </motion.h2>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center"
              >
                <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                <p className="text-white/60 mb-4">{product.desc}</p>
                <div className="text-2xl font-bold text-electric-blue mb-6">
                  {product.price}
                </div>
                <Button variant="hero">Choose Plan</Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-white/80 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
 