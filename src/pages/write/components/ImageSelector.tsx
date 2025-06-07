import { GetImagesByType, type ImageInfo } from '@/api/image';
import { fadeInUp, scaleIn } from '@/constants/animations';
import { CheckOutlined, PictureOutlined } from '@ant-design/icons';
import { Empty, Modal, Pagination, Spin } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ImageSelectorProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (image: ImageInfo) => void;
  selectedImageUrl?: string;
}

// 优化的图片项组件
const ImageItem = React.memo<{
  image: ImageInfo;
  isSelected: boolean;
  onSelect: (image: ImageInfo) => void;
}>(({ image, isSelected, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用 useMemo 缓存样式类名
  const itemClassName = useMemo(
    () => `
      relative aspect-square rounded-xl overflow-hidden cursor-pointer
      border-3 transition-all duration-200 shadow-sm hover:shadow-md
      ${isSelected
        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
        : 'border-gray-200 hover:border-gray-300'
      }
    `,
    [isSelected]
  );

  // 使用 useCallback 优化点击处理
  const handleClick = useCallback(() => {
    onSelect(image);
  }, [image, onSelect]);

  // 使用 useCallback 优化图片加载处理
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <motion.div
      // 简化动画配置，移除复杂的悬停动画
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className={itemClassName}
      onClick={handleClick}
    >
      {/* 图片容器 */}
      <div className="relative w-full h-full">
        {/* 图片加载占位符 */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <PictureOutlined className="text-2xl text-gray-400" />
          </div>
        )}

        <img
          src={image.url}
          alt={image.filename}
          className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          onLoad={handleImageLoad}
          // 添加图片解码优化
          decoding="async"
        />

        {/* 简化的悬浮遮罩 */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="text-white text-center">
            <PictureOutlined className="text-xl mb-1" />
            <p className="text-xs">选择</p>
          </div>
        </div>

        {/* 优化的选中状态 */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-blue-500 text-white rounded-full p-2 shadow-lg"
              >
                <CheckOutlined className="text-lg" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 简化的图片信息 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <p className="text-white text-xs font-medium truncate mb-1">
            {image.filename}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-gray-300 text-xs">
              {(image.size / 1024 / 1024).toFixed(1)} MB
            </p>
            {isSelected && (
              <span className="text-xs text-blue-300 font-medium">已选择</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ImageItem.displayName = 'ImageItem';

const ImageSelector: React.FC<ImageSelectorProps> = ({
  open,
  onCancel,
  onSelect,
  selectedImageUrl,
}) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // 使用 useCallback 优化加载函数
  const loadImages = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await GetImagesByType('cover,avatar', {
        page,
        page_size: pageSize,
        is_external: 1,
      });

      if (response.code === 0) {
        setImages(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // 初始化加载
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      loadImages(1);
    }
  }, [open, loadImages]);

  // 使用 useCallback 优化页面变化处理
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadImages(page);
  }, [loadImages]);

  // 使用 useCallback 优化选择处理
  const handleSelect = useCallback((image: ImageInfo) => {
    onSelect(image);
  }, [onSelect]);

  // 使用 useMemo 优化渲染的图片列表
  const renderedImages = useMemo(() => {
    return images.map((image) => (
      <ImageItem
        key={image.id}
        image={image}
        isSelected={selectedImageUrl === image.url}
        onSelect={handleSelect}
      />
    ));
  }, [images, selectedImageUrl, handleSelect]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={900}
      footer={null}
      className="image-selector-modal"
      styles={{
        body: { padding: '24px' },
      }}
      // 添加模态框销毁优化
      destroyOnClose
    >
      <div className="space-y-6">
        {/* 图片网格 */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col justify-center items-center h-96"
              >
                <Spin size="large" />
                <p className="text-gray-500 mt-4">加载图片中...</p>
              </motion.div>
            ) : images.length === 0 ? (
              <motion.div
                key="empty"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col justify-center items-center h-96"
              >
                <Empty
                  description="暂无图片"
                  className="py-16"
                  image={<PictureOutlined className="text-6xl text-gray-300" />}
                />
              </motion.div>
            ) : (
              <motion.div
                key="images"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-4 gap-4"
              >
                {renderedImages}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex justify-center pt-4 border-t border-gray-100"
          >
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条图片`
              }
              className="custom-pagination"
            />
          </motion.div>
        )}

        {/* 底部提示 */}
        <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          <p>💡 提示：点击图片即可选择作为文章封面</p>
        </div>
      </div>
    </Modal>
  );
};

export default ImageSelector;
