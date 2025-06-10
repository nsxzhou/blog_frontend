import RSSSubscribe from '@/pages/rss/RSSSubscribe';
import {
  containerVariants,
  fadeInUp,
  itemVariants,
} from '@/constants/animations';
import { motion } from 'framer-motion';
import { BookOpen, Globe, Rss, Smartphone, Zap } from 'lucide-react';
import React from 'react';

const RSSPage: React.FC = () => {
  const features = [
    {
      icon: <Zap className="text-orange-500" size={24} />,
      title: '实时更新',
      description: '第一时间获取最新文章推送，不错过任何精彩内容',
    },
    {
      icon: <Smartphone className="text-blue-500" size={24} />,
      title: '多平台支持',
      description: '支持各种RSS阅读器，手机、电脑随时随地阅读',
    },
    {
      icon: <Globe className="text-green-500" size={24} />,
      title: '无广告干扰',
      description: '纯净的阅读体验，专注于内容本身',
    },
    {
      icon: <BookOpen className="text-purple-500" size={24} />,
      title: '离线阅读',
      description: '支持离线缓存，没有网络也能阅读已下载的文章',
    },
  ];

  const readers = [
    {
      name: 'Feedly',
      url: 'https://feedly.com',
      description: '最受欢迎的RSS阅读器',
    },
    {
      name: 'Inoreader',
      url: 'https://www.inoreader.com',
      description: '功能强大的RSS服务',
    },
    {
      name: 'NewsBlur',
      url: 'https://newsblur.com',
      description: '智能RSS阅读器',
    },
    {
      name: 'The Old Reader',
      url: 'https://theoldreader.com',
      description: '经典RSS阅读体验',
    },
    {
      name: 'Reeder',
      url: 'https://reederapp.com',
      description: 'iOS/macOS优秀客户端',
    },
    {
      name: 'NetNewsWire',
      url: 'https://netnewswire.com',
      description: '免费开源RSS阅读器',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6">
            <Rss className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            RSS订阅
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过RSS订阅博客，获取最新文章更新，享受更好的阅读体验
          </p>
        </motion.div>

        {/* RSS订阅区域 */}
        <motion.div variants={itemVariants} className="mb-16">
          <RSSSubscribe />
        </motion.div>

        {/* 功能特点 */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            为什么选择RSS订阅？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RSS阅读器推荐 */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            推荐的RSS阅读器
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readers.map((reader, index) => (
              <motion.a
                key={index}
                href={reader.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                className="block bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {reader.name}
                </h3>
                <p className="text-sm text-gray-600">{reader.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* 使用说明 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            如何使用RSS订阅？
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  复制RSS链接
                </h3>
                <p className="text-gray-600">
                  点击上方的"复制链接"按钮，将RSS订阅链接复制到剪贴板
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  选择RSS阅读器
                </h3>
                <p className="text-gray-600">
                  从上面推荐的RSS阅读器中选择一个，注册并登录
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">添加订阅</h3>
                <p className="text-gray-600">
                  在RSS阅读器中添加新的订阅源，粘贴刚才复制的链接
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">开始阅读</h3>
                <p className="text-gray-600">
                  完成！现在您可以在RSS阅读器中看到最新文章了
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RSSPage;
