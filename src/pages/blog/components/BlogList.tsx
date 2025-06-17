import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spin, Button, Pagination } from 'antd';
import BlogCard from './BlogCard';
import EmptyState from './EmptyState';
import { containerVariants } from '@/constants/animations';
import type { ArticleListItem } from '@/api/article/type';

interface PaginationConfig {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

interface BlogListProps {
  filteredPosts: ArticleListItem[];  
  filterKey: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  pagination?: PaginationConfig;
}

const BlogList: React.FC<BlogListProps> = ({
  filteredPosts,
  filterKey,
  loading = false,
  error = null,
  onRetry,
  pagination
}) => {
  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="flex justify-center items-center py-20">
      <Spin size="large" />
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">{error}</p>
      {onRetry && (
        <Button type="primary" onClick={onRetry}>
          重试
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLoading()}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderError()}
          </motion.div>
        ) : filteredPosts.length > 0 ? (
          <motion.div
            key={filterKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                />
              ))}
            </motion.div>

            {/* 分页组件 */}
            {pagination && pagination.total > pagination.pageSize && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={pagination.onChange}
                  showSizeChanger={pagination.showSizeChanger}
                  showQuickJumper={pagination.showQuickJumper}
                  showTotal={pagination.showTotal}
                  className="text-center"
                />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogList; 