import { emptyStateVariants, hoverScale } from '@/constants/animations';
import {
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import type { EmptyStateProps } from './types';

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onClearSearch,
  onUpload,
}) => {
  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="text-center max-w-md">
        {/* 图标 */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <PictureOutlined className="text-4xl text-gray-400" />
          </div>
        </motion.div>

        {/* 标题和描述 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hasSearchTerm ? '未找到匹配的图片' : '还没有上传任何图片'}
          </h3>
          <p className="text-gray-500 mb-8">
            {hasSearchTerm
              ? `没有找到包含 "${searchTerm}" 的图片，请尝试其他关键词`
              : '开始上传您的第一张图片，建立您的图片库'}
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {hasSearchTerm ? (
            <>
              <motion.div variants={hoverScale}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onClearSearch}
                  size="large"
                >
                  清除搜索
                </Button>
              </motion.div>
              <motion.div variants={hoverScale}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onUpload}
                  size="large"
                >
                  上传图片
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div variants={hoverScale}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onUpload}
                size="large"
                className="px-8"
              >
                上传第一张图片
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* 提示信息 */}
        {!hasSearchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-400"
          >
            <p>支持 JPG、PNG、GIF、WebP 格式</p>
            <p>单个文件最大 10MB</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
