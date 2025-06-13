import type { ImageInfo } from '@/api/image';
import { GetImagesByType } from '@/api/image';
import { cardVariants, itemVariants } from '@/constants/animations';
import {
  PictureOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Switch, Tag, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

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
  const [randomizing, setRandomizing] = useState(false);

  // 获取所有可用图片的函数
  const getAllAvailableImages = async (): Promise<ImageInfo[]> => {
    const allImages: ImageInfo[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const pageSize = 50; // API限制的最大页面大小
    const maxPages = 20; // 最多获取20页，避免无限循环

    while (hasMorePages && currentPage <= maxPages) {
      try {
        const response = await GetImagesByType('cover,avatar', {
          page: currentPage,
          page_size: pageSize,
          is_external: 1,
        });
        if (response.code === 0 && response.data.list.length > 0) {
          allImages.push(...response.data.list);

          // 如果当前页面的图片数量小于页面大小，说明没有更多页面了
          if (response.data.list.length < pageSize) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`获取第${currentPage}页图片失败:`, error);
        hasMorePages = false;
      }
    }

    return allImages;
  };

  // 随机选择封面图片
  const handleRandomCover = useCallback(async () => {
    setRandomizing(true);


    try {
      // 获取所有可用的封面图片
      const allImages = await getAllAvailableImages();


      if (allImages.length > 0) {
        // 过滤掉当前已选择的图片，避免重复选择
        const availableImages = allImages.filter(
          (img) => img.url !== articleData.coverImage,
        );

        // 如果过滤后没有可用图片，使用全部图片
        const imagesToChooseFrom =
          availableImages.length > 0 ? availableImages : allImages;

        // 从图片列表中随机选择一张
        const randomIndex = Math.floor(
          Math.random() * imagesToChooseFrom.length,
        );
        const selectedImage = imagesToChooseFrom[randomIndex];

        onDataChange({ coverImage: selectedImage.url });

        // 显示成功消息，包含统计信息
        const messageText = `已随机选择封面图片`;

        message.success(messageText);
      } else {
        message.warning('暂无可用的封面图片，请先上传一些图片到图库');
      }
    } catch (error) {
      // 隐藏加载提示
      console.error('随机选择封面失败:', error);
    } finally {
      setRandomizing(false);
    }
  }, [onDataChange, articleData.coverImage]);

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
                  <ReloadOutlined className="text-2xl mb-1" />
                  <p className="text-sm font-medium">点击换一张</p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleRandomCover}
                loading={randomizing}
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                {randomizing ? '随机选择中...' : '换一张'}
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
              <p>🎲 点击"换一张"可随机选择新的封面图片</p>
              <p className="mt-1 text-gray-400">
                💡 系统会从所有可用图片中随机选择
              </p>
            </div>
          </motion.div>
        ) : (
          // 未选择封面图片
          <motion.button
            onClick={handleRandomCover}
            disabled={randomizing}
            className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl 
                                 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300
                                 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600
                                 select-cover-btn group disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: randomizing ? 1 : 1.02 }}
            whileTap={{ scale: randomizing ? 1 : 0.98 }}
          >
            <motion.div
              className="flex flex-col items-center"
              whileHover={{ y: randomizing ? 0 : -2 }}
              transition={{ duration: 0.2 }}
            >
              <ReloadOutlined
                className={`text-3xl mb-3 group-hover:text-blue-500 transition-colors ${
                  randomizing ? 'animate-spin' : ''
                }`}
              />
              <span className="text-sm font-medium mb-1">
                {randomizing ? '随机选择中...' : '随机选择封面'}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-blue-400">
                {randomizing ? '请稍候' : '点击从图库中随机选择'}
              </span>
            </motion.div>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WriteSidebar;
