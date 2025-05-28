import type { ImageInfo } from '@/api/image';
import { cardVariants, itemVariants } from '@/constants/animations';
import { EditOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, Switch, Tag } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import ImageSelector from './ImageSelector';

const { Option } = Select;

interface ArticleData {
  category: string;
  isDraft: boolean;
  tags: string[];
  coverImage?: string;
}

interface WriteSidebarProps {
  articleData: ArticleData;
  newTag: string;
  categories: string[];
  popularTags: string[];
  onDataChange: (data: Partial<ArticleData>) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const WriteSidebar: React.FC<WriteSidebarProps> = ({
  articleData,
  newTag,
  categories,
  popularTags,
  onDataChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}) => {
  const [imageSelectorVisible, setImageSelectorVisible] = useState(false);

  // 处理图片选择
  const handleImageSelect = (image: ImageInfo) => {
    onDataChange({ coverImage: image.url });
    setImageSelectorVisible(false);
  };

  // 移除封面图片
  const handleRemoveCover = () => {
    onDataChange({ coverImage: '' });
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* 发布设置 */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">发布设置</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章分类
            </label>
            <Select
              placeholder="选择分类"
              value={articleData.category}
              onChange={(value) => onDataChange({ category: value })}
              className="w-full"
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章状态
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {articleData.isDraft ? '草稿' : '已发布'}
              </span>
              <Switch
                checked={!articleData.isDraft}
                onChange={(checked) => onDataChange({ isDraft: !checked })}
                checkedChildren="发布"
                unCheckedChildren="草稿"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 标签管理 */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>

        {/* 当前标签 */}
        <div className="space-y-3">
          {articleData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {articleData.tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => onRemoveTag(tag)}
                  className="px-3 py-1 text-sm"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* 添加标签 */}
          <div className="flex gap-2">
            <Input
              placeholder="添加标签"
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onPressEnter={onAddTag}
              className="flex-1"
              size="small"
            />
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={onAddTag}
              disabled={!newTag.trim()}
            />
          </div>

          {/* 常用标签 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">常用标签：</p>
            <div className="flex flex-wrap gap-1">
              {popularTags
                .filter((tag) => !articleData.tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      onDataChange({
                        tags: [...articleData.tags, tag],
                      })
                    }
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 rounded transition-colors"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 封面图片 */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PictureOutlined className="text-blue-500" />
          封面图片
        </h3>

        {articleData.coverImage ? (
          // 已选择封面图片
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <motion.div
              className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cover-preview"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={articleData.coverImage}
                alt="封面图片"
                className="w-full h-full object-cover"
              />

              {/* 覆盖层，显示提示 */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="text-white text-center">
                  <EditOutlined className="text-2xl mb-1" />
                  <p className="text-sm font-medium">点击更换</p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => setImageSelectorVisible(true)}
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                更换封面
              </Button>
              <Button
                size="small"
                onClick={handleRemoveCover}
                danger
                className="hover:scale-105 transition-transform"
              >
                移除
              </Button>
            </div>

            {/* 图片信息 */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
              <p>📌 这将作为文章的封面图片显示</p>
            </div>
          </motion.div>
        ) : (
          // 未选择封面图片
          <motion.button
            onClick={() => setImageSelectorVisible(true)}
            className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl 
                                 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300
                                 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600
                                 select-cover-btn group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <PictureOutlined className="text-3xl mb-3 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium mb-1">选择封面图片</span>
              <span className="text-xs text-gray-400 group-hover:text-blue-400">
                点击从图库中选择
              </span>
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* 图片选择器 */}
      <ImageSelector
        open={imageSelectorVisible}
        onCancel={() => setImageSelectorVisible(false)}
        onSelect={handleImageSelect}
        selectedImageUrl={articleData.coverImage}
      />
    </motion.div>
  );
};

export default WriteSidebar;
