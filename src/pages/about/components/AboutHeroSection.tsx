import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DownloadOutlined, MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Button } from 'antd';

// 动画变体
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const AboutHeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const avatarY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <motion.section
      style={{ y: heroY }}
      className="relative min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 头像区域 */}
          <motion.div
            variants={itemVariants}
            style={{ y: avatarY }}
            className="mb-8"
          >
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative inline-block"
            >
              <div className="w-48 h-48 mx-auto mb-6 relative">
                <motion.div
                  className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    alt="周子瑞的头像"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                {/* 状态指示器 */}
                <motion.div
                  className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* 姓名和职业 */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                周子瑞
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-gray-600 mb-2 font-light">
              全栈开发工程师 · 技术博主
            </div>
            <div className="text-lg text-gray-500">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full mr-2 mb-2">
                前端架构师
              </span>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full mr-2 mb-2">
                React 专家
              </span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full mb-2">
                开源贡献者
              </span>
            </div>
          </motion.div>

          {/* 个人简介 */}
          <motion.div variants={itemVariants} className="mb-10">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              热爱编程，专注于现代 Web 技术栈。擅长 React、TypeScript、Node.js 等技术，
              致力于构建用户体验优秀的前端应用和高性能的后端服务。喜欢分享技术知识，
              相信代码可以让世界变得更美好。
            </p>
          </motion.div>

          {/* 操作按钮 */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              type="primary" 
              size="large" 
              icon={<DownloadOutlined />}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
            >
              下载简历
            </Button>
            <Button 
              type="default" 
              size="large" 
              icon={<MailOutlined />}
              className="h-12 px-8 rounded-full"
            >
              联系我
            </Button>
          </motion.div>

          {/* 社交链接 */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-6">
            <motion.a
              href="https://github.com/zhouzirui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问 GitHub 主页"
              className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-gray-700"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <GithubOutlined />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/zhouzirui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问 LinkedIn 主页"
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-blue-700"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedinOutlined />
            </motion.a>
            <motion.a
              href="mailto:zhouzirui@example.com"
              aria-label="发送邮件"
              className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-red-600"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <MailOutlined />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/6 w-40 h-40 bg-blue-100 rounded-full opacity-20"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/6 w-32 h-32 bg-purple-100 rounded-full opacity-15"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-100 rounded-full opacity-10"
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>
    </motion.section>
  );
};

export default AboutHeroSection; 