import React from 'react';
import { motion } from 'framer-motion';
import {
  HeroSection,
  FeaturesSection,
  BlogSection,
  SubscribeSection
} from './components';
import { containerVariants } from '@/constants/animations';

const HomePage: React.FC = () => {

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Hero区域 */}
      <HeroSection />

      {/* 最新文章 */}
      <BlogSection />

      {/* 订阅区域 */}
      <SubscribeSection />
    </motion.div>
  );
};

export default HomePage; 