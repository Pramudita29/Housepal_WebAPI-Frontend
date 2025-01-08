import { motion } from 'framer-motion';
import React from 'react';
import { Brush, ChefHat, Heart, Baby, Flower2, Wrench } from 'lucide-react';

const Footer = () => {
  const availableServices = [
    { name: "Cleaning", icon: <Brush /> },
    { name: "Cooking", icon: <ChefHat /> },
    { name: "Elderly Care", icon: <Heart /> },
    { name: "Babysitting", icon: <Baby /> },
    { name: "Gardening", icon: <Flower2 /> },
    { name: "Home Maintenance", icon: <Wrench /> },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-[#faf8f4] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-500 font-[var(--font-family-heading)]">HousePal</h3>
            <p className="text-gray-700">Quality home services at your fingertips</p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-semibold text-gray-700">Services</h4>
            <ul className="space-y-2 text-gray-700">
              {availableServices.slice(0, 4).map((service, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} className="hover:text-emerald-500 cursor-pointer">
                  {service.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-semibold text-gray-700">Company</h4>
            <ul className="space-y-2 text-gray-700">
              {['About Us', 'Careers', 'Blog', 'Press'].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} className="hover:text-emerald-500 cursor-pointer">
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-semibold text-gray-700">Support</h4>
            <ul className="space-y-2 text-gray-700">
              {['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} className="hover:text-emerald-500 cursor-pointer">
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-700">© {new Date().getFullYear()} HousePal. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;