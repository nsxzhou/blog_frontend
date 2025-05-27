import { cardHover, hoverScale } from '@/constants/animations';
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Checkbox, Dropdown, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import type { ImageCardProps } from './types';

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  selected,
  onSelect,
  onClick,
  onDelete,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 复制链接
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      message.success('图片链接已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  // 下载图片
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('开始下载图片');
  };

  // 下拉菜单项
  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: onClick,
    },
    {
      key: 'copy',
      icon: <CopyOutlined />,
      label: '复制链接',
      onClick: handleCopyUrl,
    },
    {
      key: 'download',
      icon: <DownloadOutlined />,
      label: '下载图片',
      onClick: handleDownload,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除图片',
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <motion.div
      variants={cardHover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* 选择框 */}
      <div className="absolute top-3 left-3 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered || selected ? 1 : 0,
            scale: isHovered || selected ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Checkbox
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="bg-white bg-opacity-90 rounded"
          />
        </motion.div>
      </div>

      {/* 操作菜单 */}
      <div className="absolute top-3 right-3 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <motion.button
              variants={hoverScale}
              className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreOutlined />
            </motion.button>
          </Dropdown>
        </motion.div>
      </div>

      {/* 图片预览 */}
      <div
        className="relative aspect-square bg-gray-100 overflow-hidden"
        onClick={onClick}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <img
          src={image.url}
          alt={image.original_name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        {/* 悬停遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            className="text-white text-xl"
          >
            <EyeOutlined />
          </motion.div>
        </motion.div>
      </div>

      {/* 图片信息 */}
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {image.original_name}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatFileSize(image.size)}</span>
            <span>{formatDate(image.created_at)}</span>
          </div>

          {/* 标签 */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {image.usage_type}
            </span>
            {image.storage_type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                {image.storage_type}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
