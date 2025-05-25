import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  BookOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Card, Button } from '@/components/ui';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  tags: string[];
}

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

const BlogSection: React.FC = () => {
  const blogPosts: BlogPost[] = [
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

  return (
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
              <Card padding="none" className="overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

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

                  <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

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
              </Card>
            </motion.article>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center mt-12">
          <Button variant="primary" size="lg">
            <span className="flex items-center gap-2">
              查看全部文章
              <ArrowRightOutlined />
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BlogSection; 