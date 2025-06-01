import {
  hoverScale,
  imageVariants,
  itemVariants,
  overlayVariants,
} from '@/constants/animations';
import {
  BookmarkIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  HeartIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkSolid,
  HeartIcon as HeartSolid,
} from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import type { FavoriteArticle } from '../index';

interface FavoriteCardProps {
  article: FavoriteArticle;
  onArticleClick: (id: number) => void;
  onAuthorClick: (authorId: number) => void;
  onUnfavorite: (id: number) => void;
  onLike: (id: number, isLiked: boolean) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  article,
  onArticleClick,
  onAuthorClick,
  onUnfavorite,
  onLike,
}) => {
  const [isLiked, setIsLiked] = useState(article.is_liked);
  const [likeCount, setLikeCount] = useState(article.like_count);
  const [isUnfavoriting, setIsUnfavoriting] = useState(false);

  // 处理点赞
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    // 乐观更新UI
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      await onLike(article.id, isLiked);
    } catch (error) {
      // 如果失败，回滚UI状态
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  };

  // 处理取消收藏
  const handleUnfavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUnfavoriting(true);

    try {
      await onUnfavorite(article.id);
    } catch (error) {
      setIsUnfavoriting(false);
    }
  };

  // 处理文章点击
  const handleArticleClick = () => {
    onArticleClick(article.id);
  };

  // 处理作者点击
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuthorClick(article.author_id);
  };

  // 格式化发布时间
  const formatPublishTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN,
      });
    } catch {
      return '未知时间';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group transition-all duration-300 ${
        isUnfavoriting ? 'opacity-50 pointer-events-none' : ''
      }`}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      onClick={handleArticleClick}
    >
      <div className="flex flex-col md:flex-row">
        {/* 文章封面 */}
        <div className="md:w-80 h-48 md:h-auto relative overflow-hidden bg-gray-100">
          {article.cover_image ? (
            <motion.img
              variants={imageVariants}
              initial="rest"
              whileHover="hover"
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-gray-400 text-4xl">📄</div>
            </div>
          )}

          {/* 收藏按钮悬浮层 */}
          <motion.div
            variants={overlayVariants}
            initial="rest"
            whileHover="hover"
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
          >
            <motion.button
              variants={hoverScale}
              whileHover="whileHover"
              whileTap="whileTap"
              onClick={handleUnfavorite}
              className="p-3 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200"
              title="取消收藏"
            >
              <BookmarkSolid className="w-5 h-5 text-red-500" />
            </motion.button>
          </motion.div>
        </div>

        {/* 文章内容 */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            {/* 文章标题 */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {article.title}
            </h3>

            {/* 文章摘要 */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {article.summary}
            </p>

            {/* 标签 */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* 作者和分类信息 */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <motion.button
                variants={hoverScale}
                whileHover="whileHover"
                onClick={handleAuthorClick}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
              >
                <UserIcon className="w-4 h-4" />
                {article.author_name}
              </motion.button>

              <span className="flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                {article.category_name}
              </span>

              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {formatPublishTime(article.published_at)}
              </span>
            </div>

            {/* 文章统计和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {article.view_count.toLocaleString()}
                </span>

                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {article.comment_count}
                </span>

                <span className="flex items-center gap-1">
                  <BookmarkIcon className="w-4 h-4" />
                  {article.favorite_count}
                </span>
              </div>

              {/* 点赞按钮 */}
              <motion.button
                variants={hoverScale}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isLiked ? (
                  <HeartSolid className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                {likeCount}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCard;
