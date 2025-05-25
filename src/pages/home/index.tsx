import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from '@umijs/max';
import {
  ArrowRightOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  BulbOutlined,
  GlobalOutlined,
  RocketOutlined
} from '@ant-design/icons';

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

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const heroTextVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// 简化的卡片组件
const SimpleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = "", hover = true }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      {children}
    </motion.div>
  );
};

// 简洁的按钮组件
const SimpleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
  };

  return (
    <motion.button
      className={`rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
};

// 简化的打字机效果
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay + currentIndex * 80);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-blue-600 ml-1"
      />
    </span>
  );
};

const HomePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // 轻微的视差效果
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const blogPosts = [
    {
      id: 1,
      title: "深入理解React 18的并发特性",
      excerpt: "探索React 18引入的并发渲染、Suspense边界和自动批处理等革命性特性。",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
      date: "2024-01-15",
      readTime: "8 分钟",
      views: 1234,
      likes: 89,
      tags: ["React", "JavaScript", "前端"]
    },
    {
      id: 2,
      title: "现代CSS布局技术详解",
      excerpt: "从Flexbox到Grid，全面了解现代CSS布局技术的最佳实践和使用场景。",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
      date: "2024-01-12",
      readTime: "10 分钟",
      views: 2156,
      likes: 143,
      tags: ["CSS", "布局", "设计"]
    },
    {
      id: 3,
      title: "TypeScript 5.0新特性解析",
      excerpt: "TypeScript 5.0带来了哪些激动人心的新特性？深入了解最新的开发体验。",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
      date: "2024-01-10",
      readTime: "12 分钟",
      views: 1876,
      likes: 156,
      tags: ["TypeScript", "JavaScript", "开发工具"]
    }
  ];

  const features = [
    {
      icon: <BulbOutlined className="text-2xl" />,
      title: "思维分享",
      description: "记录技术探索的心得体会",
      color: "text-yellow-600"
    },
    {
      icon: <CodeOutlined className="text-2xl" />,
      title: "技术深度",
      description: "深入解析技术原理和最佳实践",
      color: "text-blue-600"
    },
    {
      icon: <GlobalOutlined className="text-2xl" />,
      title: "开放交流",
      description: "构建开放友好的技术交流环境",
      color: "text-green-600"
    },
    {
      icon: <RocketOutlined className="text-2xl" />,
      title: "持续成长",
      description: "保持学习热情，与时俱进",
      color: "text-purple-600"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Hero区域 */}
      <motion.section
        style={{ y: heroY }}
        className="relative min-h-[85vh] flex items-center justify-center text-center px-4 py-12"
      >
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            variants={heroTextVariants}
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
            <SimpleButton variant="primary" size="lg">
              <span className="flex items-center gap-2">
                <BookOutlined />
                开始阅读
                <ArrowRightOutlined />
              </span>
            </SimpleButton>
            <SimpleButton variant="secondary" size="lg">
              <span className="flex items-center gap-2">
                <UserOutlined />
                了解更多
              </span>
            </SimpleButton>
          </motion.div>
        </div>

        {/* 简化的背景装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-30"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </motion.section>

      {/* 特色功能 */}
      <motion.section
        variants={itemVariants}
        className="py-20 px-4 bg-gray-50/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              为什么选择这里
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              专注于技术分享和思维碰撞的平台
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index * 0.1}
                className="relative"
              >
                <SimpleCard>
                  <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
                    <div className={`inline-flex p-3 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </SimpleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 最新文章 */}
      <motion.section variants={itemVariants} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              最新文章
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              分享技术思考与实践经验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                custom={index * 0.1}
                className="group"
              >
                <SimpleCard>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
                    {/* 文章封面 */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* 文章内容 */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOutlined />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 文章数据 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <EyeOutlined />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <HeartOutlined />
                            {post.likes}
                          </span>
                        </div>
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="text-blue-600"
                        >
                          <ArrowRightOutlined />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SimpleCard>
              </motion.article>
            ))}
          </div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <SimpleButton variant="primary" size="lg">
              <span className="flex items-center gap-2">
                查看全部文章
                <ArrowRightOutlined />
              </span>
            </SimpleButton>
          </motion.div>
        </div>
      </motion.section>

      {/* 订阅区域 */}
      <motion.section variants={itemVariants} className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
              variants={itemVariants}
            >
              开启技术探索之旅
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              订阅博客，第一时间获取最新的技术文章和深度思考
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="输入邮箱地址"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              />
              <SimpleButton variant="primary" size="md">
                <span className="flex items-center gap-2">
                  <ThunderboltOutlined />
                  立即订阅
                </span>
              </SimpleButton>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage; 