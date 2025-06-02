import { GetFavoriteArticles, type ArticleListItem } from '@/api/article';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/constants/animations';
import BlogCard from '@/pages/blog/components/BlogCard';
import type { BlogPost } from '@/pages/blog/components/types';
import { useRequest } from '@umijs/max';
import { Pagination, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { EmptyState, FavoriteHeader } from './components';

// 转换API数据格式为BlogPost
const convertToBlogPost = (apiArticle: ArticleListItem): BlogPost => {
  return {
    id: apiArticle.id,
    title: apiArticle.title,
    excerpt: apiArticle.summary,
    image: apiArticle.cover_image || '/default-cover.jpg',
    date: new Date(apiArticle.published_at).toLocaleDateString(),
    views: apiArticle.view_count,
    likes: apiArticle.like_count,
    comments: apiArticle.comment_count,
    tags: apiArticle.tags.map((tag) => tag.name),
    category: apiArticle.category_name,
    author: {
      name: apiArticle.author_name,
    },
    featured: apiArticle.is_top === 1,
  };
};

const FavoritesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // 调整为3的倍数，适配网格布局

  // 获取收藏文章列表
  const {
    data: favoritesData,
    loading: favoritesLoading,
    run: loadFavorites,
  } = useRequest(
    (page: number, size: number) => GetFavoriteArticles(page, size),
    {
      manual: true,
      onError: (error) => {
        console.error('获取收藏列表失败:', error);
      },
    },
  );

  // 初始化加载数据
  React.useEffect(() => {
    loadFavorites(currentPage, pageSize);
  }, [currentPage, pageSize, loadFavorites]);

  // 转换文章数据为BlogPost格式
  const displayBlogPosts = useMemo(() => {
    return (favoritesData?.list || []).map(convertToBlogPost);
  }, [favoritesData]);

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadFavorites(page, pageSize);
  };

  const totalCount = favoritesData?.total || 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 页面头部 */}
          <motion.div variants={itemVariants}>
            <FavoriteHeader totalCount={totalCount} />
          </motion.div>

          {/* 文章网格 */}
          <motion.div variants={itemVariants}>
            {favoritesLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : displayBlogPosts.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* 结果统计 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="text-sm text-gray-600">
                    共收藏{' '}
                    <span className="font-medium text-gray-900">
                      {totalCount}
                    </span>{' '}
                    篇文章
                    {totalCount > 0 && (
                      <>
                        ，当前显示第{' '}
                        <span className="font-medium text-blue-600">
                          {(currentPage - 1) * pageSize + 1}
                        </span>{' '}
                        -{' '}
                        <span className="font-medium text-blue-600">
                          {Math.min(currentPage * pageSize, totalCount)}
                        </span>{' '}
                        篇
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  {displayBlogPosts.map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* 分页 */}
                {totalCount > pageSize && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center"
                  >
                    <Pagination
                      current={currentPage}
                      total={totalCount}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条收藏`
                      }
                      className="select-none"
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FavoritesPage;
