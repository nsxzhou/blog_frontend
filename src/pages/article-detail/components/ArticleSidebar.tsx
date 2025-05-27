import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MenuOutlined,
} from '@ant-design/icons';
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
  const [showToc, setShowToc] = useState(false);

  // 生成目录
  useEffect(() => {
    if (article.content) {
      const headings = article.content
        .split('\n')
        .filter(line => line.match(/^#{1,3}\s/))
        .map((line) => {
          const match = line.match(/^(#{1,3})\s(.+)/);
          if (match) {
            const title = match[2];
            const id = `heading-${title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
            return {
              id,
              title,
              level: match[1].length
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{ id: string; title: string; level: number }>;

      setTableOfContents(headings);
    }
  }, [article.content]);

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* 其他侧边栏内容可以在这里添加 */}
      </motion.aside>

      {/* 固定目录 */}
      {tableOfContents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`fixed z-40 hidden lg:block transition-all duration-300 ${showToc
            ? 'top-1/3 right-15 -translate-y-1/2'
            : 'top-1/3 right-8 -translate-y-1/2 translate-y-[-120px]'
            }`}
        >
          {!showToc ? (
            // 收缩状态：简单的目录图标
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowToc(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 transition-all duration-200 hover:bg-gray-50"
              title="打开文章目录"
            >
              <MenuOutlined className="text-gray-600 text-lg" />
            </motion.button>
          ) : (
            // 展开状态：完整的目录面板
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 max-w-xs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowToc(false)}
                className="w-full flex items-center gap-2 p-4 text-left transition-colors rounded-t-2xl hover:bg-gray-50/50"
              >
                <MenuOutlined className="text-gray-600" />
                <span className="font-semibold text-gray-900 text-sm">文章目录</span>
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  ▼
                </motion.div>
              </motion.button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <nav className="p-4 pt-0 space-y-1 max-h-96 overflow-y-auto">
                  {tableOfContents.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block w-full text-left text-xs py-2 px-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                    >
                      {item.title}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ArticleSidebar;