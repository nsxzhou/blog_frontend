import { GetImagesByType, type ImageInfo } from '@/api/image';
import { fadeInUp, scaleIn } from '@/constants/animations';
import { CheckOutlined, PictureOutlined } from '@ant-design/icons';
import { Empty, Modal, Pagination, Spin } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface ImageSelectorProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (image: ImageInfo) => void;
  selectedImageUrl?: string;
}

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

  // 加载图片列表
  const loadImages = async (page = 1) => {
    setLoading(true);
    try {
      const response = await GetImagesByType('cover,avatar', {
        page,
        page_size: pageSize,
        is_external: 1,
      });

      if (response.code === 0) {
        let imageList = response.data.list;

        setImages(imageList);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      loadImages(1);
    }
  }, [open]);

  // 页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadImages(page);
  };

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
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.05 },
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                                            relative aspect-square rounded-xl overflow-hidden cursor-pointer
                                            border-3 transition-all duration-300 shadow-sm hover:shadow-lg
                                            ${
                                              selectedImageUrl === image.url
                                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                    onClick={() => onSelect(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* 悬浮遮罩 */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="text-white text-center">
                        <PictureOutlined className="text-2xl mb-1" />
                        <p className="text-xs">点击选择</p>
                      </div>
                    </div>

                    {/* 选中状态 */}
                    <AnimatePresence>
                      {selectedImageUrl === image.url && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-blue-500 text-white rounded-full p-3 shadow-lg"
                          >
                            <CheckOutlined className="text-xl" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 图片信息 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate mb-1">
                        {image.filename}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-xs">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex items-center gap-1">
                          {selectedImageUrl === image.url && (
                            <span className="text-xs text-blue-300 font-medium">
                              已选择
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
