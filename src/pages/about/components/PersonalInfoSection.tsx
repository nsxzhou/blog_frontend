import React from 'react';
import { motion } from 'framer-motion';
import { CalendarOutlined, EnvironmentOutlined, HeartOutlined, FireOutlined } from '@ant-design/icons';
import AnimatedCounter from './AnimatedCounter';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const PersonalInfoSection: React.FC = () => {
  const stats = [
    {
      icon: <FireOutlined className="text-2xl text-orange-500" />,
      value: 3,
      suffix: '+',
      label: '编程经验年数',
      description: '专注前端开发'
    },
    {
      icon: <HeartOutlined className="text-2xl text-red-500" />,
      value: 50,
      suffix: '+',
      label: '开源项目',
      description: '活跃贡献者'
    },
    {
      icon: <CalendarOutlined className="text-2xl text-blue-500" />,
      value: 120,
      suffix: '+',
      label: '博客文章',
      description: '技术分享'
    },
    {
      icon: <EnvironmentOutlined className="text-2xl text-green-500" />,
      value: 1000,
      suffix: '+',
      label: '代码提交',
      description: '持续学习'
    }
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            关于
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              我的故事
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我是一名充满热情的全栈开发工程师，专注于创建优雅、高效的 Web 应用程序。
            热爱学习新技术，喜欢将复杂的问题简化为用户友好的解决方案。
          </p>
        </motion.div>

        {/* 统计数据网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {stat.label}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 个人详细信息 */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900">
                我的编程之路
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  从大学时期第一次接触编程开始，我就被代码的魅力深深吸引。那种通过逻辑思维
                  创造出实用工具的成就感，让我决定将编程作为自己的职业方向。
                </p>
                <p>
                  在工作中，我专注于前端技术栈，特别是 React 生态系统。我相信好的代码不仅
                  要功能完善，更要具有良好的可读性和可维护性。我喜欢使用最新的技术来解决
                  实际问题，同时保持对性能和用户体验的高度关注。
                </p>
                <p>
                  除了工作，我还热衷于开源项目和技术分享。通过博客写作和参与社区讨论，
                  我希望能够帮助更多的开发者成长，同时也在这个过程中不断提升自己。
                </p>
              </div>
            </div>
            <div className="relative">
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop"
                  alt="现代化的编程工作环境"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  loading="lazy"
                />
              </motion.div>
              {/* 装饰元素 */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-200 rounded-full opacity-40"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PersonalInfoSection; 