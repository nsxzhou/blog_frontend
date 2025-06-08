import type { ReadingHistoryItem } from '@/api/reading-history';
import { hoverScale, itemVariants } from '@/constants/animations';
import {
  CalendarOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Checkbox } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface ReadingHistoryCardProps {
  item: ReadingHistoryItem;
  index: number;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
  deleteLoading: boolean;
}

const ReadingHistoryCard: React.FC<ReadingHistoryCardProps> = ({
  item,
  index,
  isSelectionMode,
  isSelected,
  onSelect,
  onDelete,
  deleteLoading,
}) => {
  // 格式化时间
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // 跳转到文章详情
  const handleCardClick = () => {
    if (!isSelectionMode) {
      history.push(`/article-detail/${item.article_id}`);
    }
  };

  // 处理选择
  const handleSelect = (e: any) => {
    e.nativeEvent?.stopPropagation();
    onSelect(item.id, e.target.checked);
  };

  // 处理删除
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={!isSelectionMode ? hoverScale.whileHover : undefined}
      className={`relative ${
        isSelectionMode ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <Card
        hoverable={!isSelectionMode}
        className={`h-full transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        cover={
          item.article_cover ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.article_cover}
                alt={item.article_title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-cover.jpg';
                }}
              />
              {isSelectionMode && (
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={handleSelect}
                    className="bg-white bg-opacity-80 rounded p-1"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
              <EyeOutlined className="text-4xl text-gray-400" />
              {isSelectionMode && (
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={handleSelect}
                    className="bg-white bg-opacity-80 rounded p-1"
                  />
                </div>
              )}
            </div>
          )
        }
        actions={
          !isSelectionMode
            ? [
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleteLoading}
                  onClick={handleDelete}
                  className="w-full"
                >
                  删除记录
                </Button>,
              ]
            : undefined
        }
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* 文章标题 */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
            {item.article_title}
          </h3>

          {/* 文章摘要 */}
          {item.article_summary && (
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {item.article_summary}
            </p>
          )}

          {/* 文章信息 */}
          <div className="space-y-2">
            {/* 分类和作者 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FolderOutlined />
                <span>{item.category_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserOutlined />
                <span>{item.author_name}</span>
              </div>
            </div>

            {/* 阅读时间 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <CalendarOutlined />
                <span>阅读于 {formatTime(item.read_at)}</span>
              </div>
            </div>
          </div>

          {/* 选择模式下的选择框 */}
          {isSelectionMode && !item.article_cover && (
            <div className="flex justify-center pt-2">
              <Checkbox checked={isSelected} onChange={handleSelect}>
                选择此记录
              </Checkbox>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReadingHistoryCard;
