import {
  containerVariants,
  itemVariants,
  simpleFadeIn,
} from '@/constants/animations';
import { Pagination } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import type { FavoriteArticle } from '../index';
import FavoriteCard from './FavoriteCard';

interface FavoriteListProps {
  articles: FavoriteArticle[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onArticleClick: (id: number) => void;
  onAuthorClick: (authorId: number) => void;
  onUnfavorite: (id: number) => void;
  onLike: (id: number, isLiked: boolean) => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({
  articles,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onArticleClick,
  onAuthorClick,
  onUnfavorite,
  onLike,
}) => {
  return (
    <motion.div variants={simpleFadeIn} className="space-y-6">
      {/* 结果统计 */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-gray-600">
          共找到 <span className="font-medium text-gray-900">{total}</span>{' '}
          篇收藏文章
          {total > 0 && (
            <>
              ，当前显示第{' '}
              <span className="font-medium text-blue-600">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium text-blue-600">
                {Math.min(currentPage * pageSize, total)}
              </span>{' '}
              篇
            </>
          )}
        </div>
      </motion.div>

      {/* 文章列表 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            variants={itemVariants}
            custom={index}
            transition={{ delay: index * 0.1 }}
          >
            <FavoriteCard
              article={article}
              onArticleClick={onArticleClick}
              onAuthorClick={onAuthorClick}
              onUnfavorite={onUnfavorite}
              onLike={onLike}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 分页 */}
      {total > pageSize && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-12"
        >
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total: number, range: [number, number]) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            className="select-none"
          />
        </motion.div>
      )}

      {/* 加载更多提示 */}
      {articles.length > 0 && total > currentPage * pageSize && (
        <motion.div variants={itemVariants} className="text-center py-8">
          <div className="text-gray-500 text-sm">
            还有更多精彩内容，翻页查看更多收藏文章
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoriteList;
