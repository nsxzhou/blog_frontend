import avatar from '@/assets/avatar.jpg';
import { QRCodeModal } from '@/components/ui';
import {
  floatingVariants,
  heroVariants,
  iconHover,
  itemVariants,
} from '@/constants/animations';
import {
  DownloadOutlined,
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useState } from 'react';

const AboutHeroSection: React.FC = () => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrType, setQrType] = useState<'wechat' | 'qq' | null>(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const avatarY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const handleSocialClick = (type: 'github' | 'wechat' | 'qq') => {
    switch (type) {
      case 'github':
        window.open('https://github.com/nsxzhou', '_blank');
        break;
      case 'wechat':
        setQrType('wechat');
        setQrModalOpen(true);
        break;
      case 'qq':
        setQrType('qq');
        setQrModalOpen(true);
        break;
    }
  };

  const handleDownloadResume = () => {
    const resumeUrl =
      'https://typora-1324789722.cos.ap-guangzhou.myqcloud.com/images/%E6%BA%BA%E6%B0%B4%E5%AF%BB%E8%88%9F%E7%9A%84%E7%AE%80%E5%8E%86.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = '溺水寻舟-简历.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <motion.section
      style={{ y: heroY }}
      className="relative min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div variants={heroVariants} initial="initial" animate="animate">
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
                    src={avatar}
                    alt="NSZHOU的头像"
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
                NSZHOU
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-gray-600 mb-2 font-light">
              全栈开发工程师 · 技术博主
            </div>
            <div className="text-lg text-gray-500">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full mr-2 mb-2">
                Golang 开发
              </span>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full mr-2 mb-2">
                React Vue
              </span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full mb-2">
                Github 开源贡献者
              </span>
            </div>
          </motion.div>

          {/* 个人简介 */}
          <motion.div variants={itemVariants} className="mb-10">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              热爱编程，专注于现代 Web 技术栈。擅长
              React、Vue、TypeScript、Golang 等技术，
              致力于构建用户体验优秀的前端应用和高性能的后端服务。喜欢分享技术知识，
              相信代码可以让世界变得更美好。
            </p>
          </motion.div>

          {/* 操作按钮 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
              onClick={handleDownloadResume}
            >
              下载简历
            </Button>
          </motion.div>

          {/* 社交链接 */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6"
          >
            <motion.a
              href="https://github.com/nsxzhou"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问 GitHub 主页"
              className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-gray-700"
              {...iconHover}
            >
              <GithubOutlined />
            </motion.a>
            <motion.button
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-blue-700"
              {...iconHover}
              onClick={() => handleSocialClick('wechat')}
            >
              <WechatOutlined />
            </motion.button>
            <motion.button
              className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-lg transition-colors hover:bg-red-600"
              {...iconHover}
              onClick={() => handleSocialClick('qq')}
            >
              <QqOutlined />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      {/* 二维码模态框 */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setQrType(null);
        }}
        type={qrType}
      />

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
            ease: 'linear',
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
            ease: 'linear',
          }}
        />
      </div>
    </motion.section>
  );
};

export default AboutHeroSection;
