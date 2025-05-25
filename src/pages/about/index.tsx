import React from 'react';
import { motion } from 'framer-motion';
import {
  AboutHeroSection,
  PersonalInfoSection,
  SkillsSection,
  ExperienceSection,
  HobbiesSection,
  ContactSection
} from './components/index';

// 页面容器动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const AboutPage: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* 英雄区域 */}
      <AboutHeroSection />

      {/* 个人信息区域 */}
      <PersonalInfoSection />

      {/* 技能展示区域 */}
      <SkillsSection />

      {/* 经验时间线 */}
      <ExperienceSection />

      {/* 兴趣爱好 */}
      <HobbiesSection />

      {/* 联系方式 */}
      <ContactSection />
    </motion.div>
  );
};

export default AboutPage;
