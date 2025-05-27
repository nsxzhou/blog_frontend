import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  BookOutlined,
  CopyOutlined
} from '@ant-design/icons';
import type { BlogPost } from '../../blog/components/types';
import { contentVariants } from '@/constants/animations';

interface ArticleContentProps {
  article: BlogPost;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
  tooltip?: string;
  iconColor?: string;
}> = ({ icon, label, count, active, onClick, tooltip, iconColor }) => {
  const isFloatingButton = !label; // 判断是否为浮动按钮

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`transition-all duration-200 ${isFloatingButton
          ? `w-10 h-10 rounded-xl flex items-center justify-center ${active
            ? 'bg-red-50 shadow-lg'
            : 'bg-white/80 hover:bg-gray-50 shadow-md'
          }`
          : `flex items-center gap-2 px-4 py-2 rounded-lg border ${active
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`
        }`}
      title={isFloatingButton ? tooltip : undefined}
    >
      <span
        className={`${isFloatingButton ? 'text-lg' : ''}`}
        style={{ color: iconColor }}
      >
        {icon}
      </span>
      {!isFloatingButton && label && (
        <span className="text-sm font-medium">{label}</span>
      )}
      {!isFloatingButton && count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </motion.button>
  );
};

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [readingProgress, setReadingProgress] = useState(0);

  // 阅读进度计算
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  const handleBookmark = () => {
    console.log('收藏文章');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Markdown 组件配置
  const markdownComponents = {
    // 自定义代码块渲染
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg !mt-4 !mb-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    // 自定义标题样式
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2">
        {children}
      </h3>
    ),
    // 自定义段落样式
    p: ({ children }: any) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    // 自定义列表样式
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="mb-1">
        {children}
      </li>
    ),
    // 自定义引用样式
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">
        {children}
      </blockquote>
    ),
    // 自定义链接样式
    a: ({ children, href }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-700 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    // 自定义表格样式
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-50">
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
        {children}
      </td>
    ),
  };

  return (
    <>
      <motion.article
        variants={contentVariants}
        initial="initial"
        animate="animate"
        className="relative"
      >
        {/* 浮动操作栏 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-1/2 right-6 -translate-y-1/2 z-40 hidden lg:block"
        >
          <div className="flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-gray-200/50">
            <ActionButton
              icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
              label=""
              active={isLiked}
              onClick={handleLike}
              tooltip={isLiked ? `已点赞 (${likeCount})` : `点赞 (${likeCount})`}
              iconColor={isLiked ? '#ef4444' : '#f87171'}
            />
            <ActionButton
              icon={<ShareAltOutlined />}
              label=""
              onClick={handleShare}
              tooltip="分享文章"
              iconColor="#3b82f6"
            />
            <ActionButton
              icon={<BookOutlined />}
              label=""
              onClick={handleBookmark}
              tooltip="收藏文章"
              iconColor="#f59e0b"
            />
            <ActionButton
              icon={<CopyOutlined />}
              label=""
              onClick={handleCopyLink}
              tooltip="复制链接"
              iconColor="#6b7280"
            />
          </div>
        </motion.div>

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {article.title}
          </motion.h1>

          <motion.div
            className="prose-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.div>

        {/* 移动端操作栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:hidden mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-3">
            <ActionButton
              icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
              label="点赞"
              count={likeCount}
              active={isLiked}
              onClick={handleLike}
            />
            <ActionButton
              icon={<ShareAltOutlined />}
              label="分享"
              onClick={handleShare}
            />
            <ActionButton
              icon={<BookOutlined />}
              label="收藏"
              onClick={handleBookmark}
            />
            <ActionButton
              icon={<CopyOutlined />}
              label="复制链接"
              onClick={handleCopyLink}
            />
          </div>
        </motion.div>

        {/* 文章结尾 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="my-12 pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            - 全文完 -
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>如果觉得文章不错，请分享给更多人</span>
          </div>
        </motion.div>
      </motion.article>
    </>
  );
};

export default ArticleContent; 