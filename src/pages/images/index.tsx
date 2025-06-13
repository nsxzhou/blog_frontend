import {
  BatchDeleteImages,
  DeleteImage,
  GetImageList,
  GetImageStatistics,
  type GetImageListReq,
  type ImageInfo,
} from '@/api/image';
import {
  cardHover,
  containerVariants,
  fadeInUp,
  hoverScale,
  itemVariants,
} from '@/constants/animations';
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Empty,
  message,
  Modal,
  Spin,
  Tag,
  Tooltip,
  Select,
  DatePicker,
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ImageDetailModal,
  ImageStats,
  ImageUploadModal,
} from './components';

// 优化的图片卡片组件
const ImageCard = React.memo<{
  image: ImageInfo;
  isSelected: boolean;
  isBatchMode: boolean;
  onSelect: (imageId: number, checked: boolean) => void;
  onViewDetail: (image: ImageInfo) => void;
  onDownload: (image: ImageInfo) => void;
  onDelete: (image: ImageInfo) => void;
}>(({ image, isSelected, isBatchMode, onSelect, onViewDetail, onDownload, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用 useCallback 优化事件处理
  const handleSelect = useCallback((e: any) => {
    onSelect(image.id, e.target.checked);
  }, [image.id, onSelect]);

  const handleViewDetail = useCallback(() => {
    onViewDetail(image);
  }, [image, onViewDetail]);

  const handleDownload = useCallback(() => {
    onDownload(image);
  }, [image, onDownload]);

  const handleDelete = useCallback(() => {
    onDelete(image);
  }, [image, onDelete]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // 格式化文件大小
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // 格式化日期
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  }, []);

  // 获取使用类型标签颜色
  const getUsageTypeColor = useCallback((type: string) => {
    const colorMap: Record<string, string> = {
      avatar: 'blue',
      cover: 'green',
      content: 'orange',
      other: 'gray',
    };
    return colorMap[type] || 'gray';
  }, []);

  // 获取存储类型标签颜色
  const getStorageTypeColor = useCallback((type: string) => {
    const colorMap: Record<string, string> = {
      local: 'purple',
      cos: 'cyan',
    };
    return colorMap[type] || 'gray';
  }, []);

  return (
    <motion.div
      // 简化动画配置
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group"
    >
      {/* 批量选择复选框 */}
      {isBatchMode && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onChange={handleSelect}
            className="bg-white/80 backdrop-blur-sm rounded"
          />
        </div>
      )}

      {/* 操作按钮 */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          <Tooltip title="查看详情">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewDetail}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-white/90 transition-colors"
            >
              <EyeOutlined className="text-gray-600" />
            </motion.button>
          </Tooltip>
          <Tooltip title="下载图片">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-white/90 transition-colors"
            >
              <DownloadOutlined className="text-gray-600" />
            </motion.button>
          </Tooltip>
          <Tooltip title="删除图片">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-red-50 transition-colors"
            >
              <DeleteOutlined className="text-red-500" />
            </motion.button>
          </Tooltip>
        </div>
      </div>

      {/* 图片展示 */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {/* 图片加载占位符 */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <FileImageOutlined className="text-2xl text-gray-400" />
          </div>
        )}

        <img
          src={image.url}
          alt={image.filename}
          className={`w-full h-full object-cover transition-all duration-200 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
        />
      </div>

      {/* 图片信息 */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
          {image.filename}
        </h3>

        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>{formatFileSize(image.size)}</span>
          <span>{formatDate(image.created_at)}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          <Tag color={getUsageTypeColor(image.usage_type)}>
            {image.usage_type}
          </Tag>
          <Tag color={getStorageTypeColor(image.storage_type)}>
            {image.storage_type}
          </Tag>
        </div>
      </div>
    </motion.div>
  );
});

ImageCard.displayName = 'ImageCard';

const ImagesManagementPage: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExternalFilter, setIsExternalFilter] = useState<0 | 1 | 2>(2);
  const [usageTypeFilter, setUsageTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 获取图片列表
  const fetchImages = useCallback(async (params?: GetImageListReq) => {
    setLoading(true);
    try {
      const response = await GetImageList({
        page: pagination.current,
        page_size: pagination.pageSize,
        is_external: isExternalFilter,
        usage_type: usageTypeFilter === '' ? undefined : usageTypeFilter,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1],
        ...params,
      });

      if (response.code === 0 && response.data) {
        // 直接使用服务端返回的数据，不进行客户端过滤和排序
        setImages(response.data.list || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          current: params?.page || pagination.current,
        }));
      } else {
        setImages([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 1,
        }));
      }
    } catch (error) {
      console.error('获取图片列表失败:', error);
      setImages([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        current: 1,
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, isExternalFilter, usageTypeFilter, dateRange]);

  // 获取统计数据
  const [statistics, setStatistics] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await GetImageStatistics();
      if (response.code === 0) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchImages();
    fetchStatistics();
  }, []);

  // 筛选变化时重新加载（移除搜索和排序的依赖）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchImages({ page: 1, page_size: pagination.pageSize });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [usageTypeFilter, dateRange, isExternalFilter]);

  // 计算统计数据
  const stats = useMemo(() => {
    if (!statistics) return { total: 0, totalSize: 0, recentlyAdded: 0 };

    const recentlyAdded = images.filter((image) => {
      const createDate = new Date(image.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createDate > weekAgo;
    }).length;

    return {
      total: statistics.total_images || 0,
      totalSize: statistics.total_size || 0,
      recentlyAdded,
      avatarImages: statistics.avatar_images || 0,
      coverImages: statistics.cover_images || 0,
      contentImages: statistics.content_images || 0,
      localImages: statistics.local_images || 0,
      cosImages: statistics.cos_images || 0,
    };
  }, [statistics, images]);

  // 处理上传
  const handleUpload = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  // 处理删除单个图片
  const handleDeleteImage = useCallback((image: ImageInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除图片"${image.filename}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await DeleteImage(image.id);
          if (response.code === 0) {
            message.success('图片删除成功');
            fetchImages();
            fetchStatistics();
          } 
        } catch (error) {
          console.error('删除图片失败:', error);
        }
      },
    });
  }, [fetchImages, fetchStatistics]);

  // 处理批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedImages.length === 0) {
      message.warning('请先选择要删除的图片');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedImages.length} 张图片吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await BatchDeleteImages({
            image_ids: selectedImages,
          });
          if (response.code === 0) {
            message.success(`成功删除 ${selectedImages.length} 张图片`);
            setSelectedImages([]);
            setBatchMode(false);
            fetchImages();
            fetchStatistics();
          } 
        } catch (error) {
          console.error('批量删除失败:', error);
        }
      },
    });
  }, [selectedImages, fetchImages, fetchStatistics]);

  // 处理查看详情
  const handleViewDetail = useCallback((image: ImageInfo) => {
    setSelectedImage(image);
    setIsDetailModalOpen(true);
  }, []);

  // 处理下载图片
  const handleDownloadImage = useCallback((image: ImageInfo) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // 处理批量选择
  const handleBatchSelect = useCallback((imageId: number, checked: boolean) => {
    if (checked) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  }, []);

  // 处理全选
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map((image) => image.id));
    } else {
      setSelectedImages([]);
    }
  }, [images]);

  // 处理表单提交成功
  const handleUploadSuccess = useCallback(() => {
    setIsUploadModalOpen(false);
    fetchImages();
    fetchStatistics();
  }, [fetchImages, fetchStatistics]);

  // 处理分页变化
  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: newPageSize,
    }));
    fetchImages({ page, page_size: newPageSize });
  }, [pagination.pageSize, fetchImages]);

  // 使用 useMemo 优化渲染的图片列表
  const renderedImages = useMemo(() => {
    return images.map((image) => (
      <ImageCard
        key={image.id}
        image={image}
        isSelected={selectedImages.includes(image.id)}
        isBatchMode={batchMode}
        onSelect={handleBatchSelect}
        onViewDetail={handleViewDetail}
        onDownload={handleDownloadImage}
        onDelete={handleDeleteImage}
      />
    ));
  }, [images, selectedImages, batchMode, handleBatchSelect, handleViewDetail, handleDownloadImage, handleDeleteImage]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileImageOutlined className="text-blue-600" />
                图片管理
              </h1>
              <p className="text-gray-600 mt-2">管理和组织您的图片资源</p>
            </div>
            <div className="flex items-center gap-3">
              {batchMode && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={
                      selectedImages.length === images.length &&
                      images.length > 0
                    }
                    indeterminate={
                      selectedImages.length > 0 &&
                      selectedImages.length < images.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    全选
                  </Checkbox>
                  <Button
                    danger
                    onClick={handleBatchDelete}
                    disabled={selectedImages.length === 0}
                    icon={<DeleteOutlined />}
                  >
                    批量删除 ({selectedImages.length})
                  </Button>
                </motion.div>
              )}
              <Button
                onClick={() => setBatchMode(!batchMode)}
                type={batchMode ? 'primary' : 'default'}
              >
                {batchMode ? '退出批量' : '批量管理'}
              </Button>
              <motion.button
                {...hoverScale}
                onClick={handleUpload}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <PlusOutlined />
                上传图片
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div variants={itemVariants} className="mb-8">
          <ImageStats statistics={statistics} loading={statsLoading} />
        </motion.div>

        {/* 搜索和过滤 */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            {/* 功能提示 */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 提示：当前版本暂不支持搜索和排序功能，请使用筛选条件来查找图片
              </p>
            </div>

            {/* 过滤器和操作栏 */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* 过滤器 */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FilterOutlined className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">过滤:</span>
                </div>

                <Select
                  value={usageTypeFilter || 'all'}
                  onChange={(value) => setUsageTypeFilter(value === 'all' ? '' : value)}
                  className="min-w-[120px]"
                  placeholder="使用类型"
                >
                  <Select.Option value="all">全部类型</Select.Option>
                  <Select.Option value="avatar">头像</Select.Option>
                  <Select.Option value="cover">封面</Select.Option>
                  <Select.Option value="content">内容</Select.Option>
                  <Select.Option value="other">其他</Select.Option>
                </Select>

                <Select
                  value={isExternalFilter}
                  onChange={setIsExternalFilter}
                  className="min-w-[120px]"
                  placeholder="存储位置"
                >
                  <Select.Option value={2}>全部位置</Select.Option>
                  <Select.Option value={1}>外部存储</Select.Option>
                  <Select.Option value={0}>本地存储</Select.Option>
                </Select>

                <DatePicker.RangePicker
                  onChange={(dates) => {
                    const dateRange =
                      dates && dates[0] && dates[1]
                        ? ([
                          dates[0].format('YYYY-MM-DD'),
                          dates[1].format('YYYY-MM-DD'),
                        ] as [string, string])
                        : null;
                    setDateRange(dateRange);
                  }}
                  placeholder={['开始日期', '结束日期']}
                  className="min-w-[200px]"
                />
              </div>

              {/* 操作栏 */}
              <div className="flex items-center gap-4">
                {/* 全选操作 */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedImages.length === images.length &&
                      images.length > 0
                    }
                    indeterminate={
                      selectedImages.length > 0 &&
                      selectedImages.length < images.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    <span className="text-sm text-gray-600">
                      {selectedImages.length > 0
                        ? `已选择 ${selectedImages.length} 项`
                        : `全选 (${images.length})`}
                    </span>
                  </Checkbox>
                </div>

                {/* 批量操作 */}
                {selectedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div {...hoverScale}>
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleBatchDelete}
                        size="small"
                      >
                        批量删除
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {/* 统计信息 */}
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                  共 {images.length} 张图片
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 图片列表 */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : images.length === 0 ? (
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-xl p-12 text-center shadow-sm"
            >
              <Empty
                description="暂无图片"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <motion.button
                  {...hoverScale}
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  上传第一张图片
                </motion.button>
              </Empty>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {renderedImages}
              </div>

              {/* 分页 */}
              {pagination && pagination.total > pagination.pageSize && (
                <motion.div
                  variants={fadeInUp}
                  className="flex justify-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-sm text-gray-500">
                      共 {pagination.total} 张图片
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        disabled={pagination.current === 1}
                        onClick={() => handlePageChange(pagination.current - 1)}
                      >
                        上一页
                      </Button>
                      <span className="text-sm text-gray-500">
                        第 {pagination.current} /{' '}
                        {Math.ceil(pagination.total / pagination.pageSize)} 页
                      </span>
                      <Button
                        disabled={
                          pagination.current >=
                          Math.ceil(pagination.total / pagination.pageSize)
                        }
                        onClick={() => handlePageChange(pagination.current + 1)}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* 上传模态框 */}
        <ImageUploadModal
          visible={isUploadModalOpen}
          onCancel={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />

        {/* 详情模态框 */}
        {selectedImage && (
          <ImageDetailModal
            visible={isDetailModalOpen}
            image={selectedImage}
            onCancel={() => {
              setIsDetailModalOpen(false);
              setSelectedImage(null);
            }}
            onUpdate={() => {
              fetchImages();
              fetchStatistics();
            }}
            onDelete={(id) => {
              handleDeleteImage(selectedImage);
              setIsDetailModalOpen(false);
              setSelectedImage(null);
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ImagesManagementPage;
