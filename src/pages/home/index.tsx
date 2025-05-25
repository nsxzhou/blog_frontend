import React from 'react';
import { motion } from 'framer-motion';
import {
  HeroSection,
  FeaturesSection,
  BlogSection,
  SubscribeSection
} from './components';

// 简化的动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

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

      {/* 特色功能 */}
      <FeaturesSection />

      {/* 最新文章 */}
      <BlogSection />

      {/* 订阅区域 */}
      <SubscribeSection />
    </motion.div>
  );
};

export default HomePage; 