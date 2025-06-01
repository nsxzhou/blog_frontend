import {
  emptyStateVariants,
  floatingAnimation,
  hoverScale,
  itemVariants,
} from '@/constants/animations';
import {
  BookmarkIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { history } from '@umijs/max';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface EmptyStateProps {
  searchTerm?: string;
  onClearSearch?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onClearSearch,
}) => {
  const handleExploreArticles = () => {
    history.push('/blog');
  };

  const handleGoHome = () => {
    history.push('/');
  };

  // 如果是搜索结果为空
  if (searchTerm) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-16"
      >
        <motion.div variants={itemVariants} className="max-w-md mx-auto">
          {/* 搜索图标 */}
          <motion.div
            variants={floatingAnimation}
            className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6"
          >
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
          </motion.div>

          {/* 标题 */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            未找到相关收藏
          </h3>

          {/* 描述 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            没有找到包含 "
            <span className="font-medium text-blue-600">{searchTerm}</span>"
            的收藏文章
            <br />
            试试调整搜索关键词或浏览其他内容
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div variants={hoverScale}>
              <Button
                type="primary"
                size="large"
                onClick={onClearSearch}
                className="px-6"
              >
                清除搜索条件
              </Button>
            </motion.div>

            <motion.div variants={hoverScale}>
              <Button
                size="large"
                onClick={handleExploreArticles}
                className="px-6"
              >
                浏览所有文章
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // 如果是完全没有收藏
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      className="text-center py-20"
    >
      <motion.div variants={itemVariants} className="max-w-lg mx-auto">
        {/* 收藏图标组合 */}
        <div className="relative mb-8">
          <motion.div
            variants={floatingAnimation}
            className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full"
          >
            <BookmarkIcon className="w-16 h-16 text-pink-500" />
          </motion.div>

          {/* 装饰性图标 */}
          <motion.div
            variants={floatingAnimation}
            transition={{ delay: 0.5, duration: 3 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
          >
            <SparklesIcon className="w-4 h-4 text-yellow-500" />
          </motion.div>

          <motion.div
            variants={floatingAnimation}
            transition={{ delay: 1, duration: 4 }}
            className="absolute -bottom-1 -left-3 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"
          >
            <HeartIcon className="w-3 h-3 text-red-500" />
          </motion.div>
        </div>

        {/* 标题 */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          还没有收藏任何文章
        </h3>

        {/* 描述 */}
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          发现感兴趣的文章时，点击收藏按钮就能保存到这里
          <br />
          开始探索精彩内容，建立您的专属收藏夹吧！
        </p>

        {/* 特性介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            variants={itemVariants}
            className="p-4 bg-blue-50 rounded-xl"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <BookmarkIcon className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">便捷收藏</h4>
            <p className="text-sm text-gray-600">一键收藏喜欢的文章</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-4 bg-green-50 rounded-xl"
          >
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <MagnifyingGlassIcon className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">快速检索</h4>
            <p className="text-sm text-gray-600">轻松找到收藏的内容</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-4 bg-purple-50 rounded-xl"
          >
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <HeartIcon className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">个人专属</h4>
            <p className="text-sm text-gray-600">打造专属阅读清单</p>
          </motion.div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div variants={hoverScale}>
            <Button
              type="primary"
              size="large"
              onClick={handleExploreArticles}
              icon={<SparklesIcon className="w-4 h-4" />}
              className="px-8"
            >
              开始探索文章
            </Button>
          </motion.div>

          <motion.div variants={hoverScale}>
            <Button size="large" onClick={handleGoHome} className="px-8">
              返回首页
            </Button>
          </motion.div>
        </div>

        {/* 提示文字 */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm text-gray-500">
            💡 小贴士：在文章详情页点击
            <BookmarkIcon className="w-4 h-4 inline mx-1" />
            图标即可收藏文章
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
