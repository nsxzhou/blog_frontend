import { containerVariants, itemVariants } from '@/constants/animations';
import { Pagination } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ImageCard } from './ImageCard';
import type { ImageGridProps } from './types';

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  selectedImages,
  onImageSelect,
  onImageClick,
  onImageDelete,
  pagination,
}) => {
  return (
    <div className="space-y-6">
      {/* 图片网格 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <AnimatePresence mode="wait">
          {images.map((image) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              layout
              className="relative"
            >
              <ImageCard
                image={image}
                selected={selectedImages.includes(image.id)}
                onSelect={(selected) => onImageSelect(image.id, selected)}
                onClick={() => onImageClick(image)}
                onDelete={() => onImageDelete(image.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 分页 */}
      {pagination.total > pagination.pageSize && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8"
        >
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `第 ${range[0]}-${range[1]} 项，共 ${total} 项`
            }
            className="bg-white rounded-lg shadow-sm px-4 py-2"
          />
        </motion.div>
      )}
    </div>
  );
};

export default ImageGrid;
