import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MenuOutlined,
  UserOutlined,
  TagOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Card } from '@/components/ui';
import type { BlogPost } from '../../blog/components/types';

interface ArticleSidebarProps {
  article: BlogPost;
}

const sidebarVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ article }) => {
  const [tableOfContents, setTableOfContents] = useState<Array<{
    id: string;
    title: string;
    level: number;
  }>>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  // 生成目录
  useEffect(() => {
    if (article.content) {
      const headings = article.content
        .split('\n')
        .filter(line => line.match(/^#{1,3}\s/))
        .map((line, index) => {
          const match = line.match(/^(#{1,3})\s(.+)/);
          if (match) {
            return {
              id: `heading-${index}`,
              title: match[2],
              level: match[1].length
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{ id: string; title: string; level: number }>;
      
      setTableOfContents(headings);
    }
  }, [article.content]);

  // 监听滚动，更新当前活动章节
  useEffect(() => {
    const handleScroll = () => {
      // 简化的实现，实际应用中可能需要更复杂的逻辑
      const headings = document.querySelectorAll('h1, h2, h3');
      const scrollPosition = window.scrollY + 100;

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement;
        if (element.offsetTop <= scrollPosition) {
          setActiveSection(`heading-${index}`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* 目录 */}
      {tableOfContents.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MenuOutlined className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">文章目录</h3>
            </div>
            <nav className="space-y-2">
              {tableOfContents.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 16 + 8}px` }}
                >
                  {item.title}
                </motion.button>
              ))}
            </nav>
          </Card>
        </motion.div>
      )}

      {/* 作者信息 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserOutlined className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">作者信息</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">{article.author.name}</h4>
              <p className="text-sm text-gray-500">前端开发工程师</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            专注于 React、TypeScript 和现代前端开发技术，喜欢分享技术心得和最佳实践。
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            关注作者
          </motion.button>
        </Card>
      </motion.div>

      {/* 文章标签 */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TagOutlined className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">相关标签</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.aside>
  );
};

export default ArticleSidebar; 