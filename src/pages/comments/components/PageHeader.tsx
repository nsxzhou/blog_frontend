import type { ArticleListItem } from '@/api/article';
import { fadeIn, itemVariants } from '@/constants/animations';
import {
  FileTextOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import type { ViewMode } from '../types';

const { Title, Text } = Typography;

interface PageHeaderProps {
  viewMode: ViewMode;
  selectedArticle: ArticleListItem | null;
  onBackToArticles: () => void;
  onViewAllComments?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  viewMode,
  selectedArticle,
  onBackToArticles,
  onViewAllComments,
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">

          <div>
            <Title level={1} className="text-3xl font-bold text-gray-900 mb-2">
              评论管理
            </Title>
            <AnimatePresence mode="wait">
              {viewMode === 'articles' ? (
                <motion.div key="articles-subtitle" {...fadeIn}>
                  <Text className="text-gray-600">选择文章查看相关评论</Text>
                </motion.div>
              ) : viewMode === 'comments' ? (
                <motion.div key="comments-subtitle" {...fadeIn}>
                  <Text className="text-gray-600">
                    管理「{selectedArticle?.title}」的评论
                  </Text>
                </motion.div>
              ) : (
                <motion.div key="all-comments-subtitle" {...fadeIn}>
                  <Text className="text-gray-600">管理所有评论数据</Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-3">
          {viewMode === 'comments' && (
            <Button
              icon={<FileTextOutlined />}
              onClick={onBackToArticles}
              className="flex items-center space-x-2"
            >
              文章列表
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;
