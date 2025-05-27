import React from 'react';
import { motion } from 'framer-motion';
import AboutHeroSection from './components/AboutHeroSection';
import PersonalInfoSection from './components/PersonalInfoSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import HobbiesSection from './components/HobbiesSection';
import ContactSection from './components/ContactSection';
import { containerVariantsSlow } from '@/constants';

const AboutPage: React.FC = () => {
  return (
    <motion.div
      variants={containerVariantsSlow}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white"
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
