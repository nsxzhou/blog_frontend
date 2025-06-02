import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui';
import TypewriterText from './TypewriterText';
import {
  containerVariants,
  itemVariants,
  floatingAnimation,
  letterVariants
} from '@/constants/animations';
import { useNavigate } from '@umijs/max';

const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const navigate = useNavigate();
  return (
    <motion.section
      style={{ y: heroY }}
      className="relative min-h-[85vh] flex items-center justify-center text-center px-4 py-12"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            {"思维".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            <span className="text-blue-600 mx-2">·</span>
            {"笔记".split("").map((char, index) => (
              <motion.span
                key={index + 2}
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-gray-600 mb-6 font-light leading-relaxed max-w-3xl mx-auto">
            记录
            <span className="text-blue-600 font-medium">技术探索</span>
            的点滴思考，分享
            <span className="text-gray-800 font-medium">编程智慧</span>
            与成长感悟
          </p>
          <div className="text-lg text-gray-500">
            <TypewriterText text="每一行代码都值得深度思考..." delay={800} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg" onClick={() => navigate('/blog')}>
            <span className="flex items-center gap-2">
              <BookOutlined />
              开始阅读
              <ArrowRightOutlined />
            </span>
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/about')}>
            <span className="flex items-center gap-2">
              <UserOutlined />
              了解更多
            </span>
          </Button>
        </motion.div>
      </div>

      {/* 简化的背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-30"
          {...floatingAnimation}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20"
          {...floatingAnimation}
        />
      </div>
    </motion.section>
  );
};

export default HeroSection; 