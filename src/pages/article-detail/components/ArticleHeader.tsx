import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { history } from '@umijs/max';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Button } from '@/components/ui';
import {
  articleHeaderVariants,
  imageVariants,
  fadeInUp,
  hoverScale
} from '@/constants/animations';
import AuthorModal from './AuthorModal';
import type { BlogPost } from '../../blog/components/types';

interface ArticleHeaderProps {
  article: BlogPost;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const handleBack = () => {
    history.push('/blog');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    // 书签功能
    console.log('收藏文章');
  };

  const handleAuthorClick = () => {
    setIsAuthorModalOpen(true);
  };

  const handleCloseAuthorModal = () => {
    setIsAuthorModalOpen(false);
  };

  return (
    <>
      <motion.header
        variants={articleHeaderVariants}
        className="relative"
      >
        {/* 返回按钮 */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="my-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftOutlined className="mr-2" />
            返回博客
          </Button>
        </motion.div>

        {/* 文章封面图 */}
        <motion.div
          variants={imageVariants}
          className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* 特色标签 */}
          {article.featured && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-6 left-6"
            >
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                精选文章
              </span>
            </motion.div>
          )}

          {/* 操作按钮 */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="absolute top-6 right-6 flex gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <ShareAltOutlined />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <BookOutlined />
            </Button>
          </motion.div>
        </motion.div>

        {/* 分类标签 */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </span>
        </motion.div>

        {/* 文章标题 */}
        <motion.h1
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
        >
          {article.title}
        </motion.h1>

        {/* 文章摘要 */}
        <motion.p
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 leading-relaxed mb-8"
        >
          {article.excerpt}
        </motion.p>

        {/* 作者信息和文章元数据 */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between py-6 border-t border-b border-gray-200"
        >
          {/* 作者信息 - 添加点击功能 */}
          <motion.div
            className="flex items-center gap-4 mb-4 md:mb-0 cursor-pointer group"
            onClick={handleAuthorClick}
            {...hoverScale}
          >
            <div className="relative">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover transition-all duration-200 group-hover:shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-all duration-200" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {article.author.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  {article.date}
                </span>
              </div>
            </div>
            {/* 点击提示 */}
            <motion.div
              className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              点击查看作者信息
            </motion.div>
          </motion.div>

          {/* 文章统计 */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <EyeOutlined />
              {article.views} 阅读
            </span>
            <span className="flex items-center gap-1">
              <HeartOutlined />
              {article.likes} 点赞
            </span>
            <span className="flex items-center gap-1">
              <CommentOutlined />
              {article.comments} 评论
            </span>
          </div>
        </motion.div>

        {/* 标签 */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-2 mt-6"
        >
          {article.tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
            >
              #{tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.header>

      {/* 作者详情弹窗 */}
      <AuthorModal
        author={article.author}
        isOpen={isAuthorModalOpen}
        onClose={handleCloseAuthorModal}
      />
    </>
  );
};

export default ArticleHeader;