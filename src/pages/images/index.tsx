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
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageDetailModal,
  ImageFilters,
  ImageStats,
  ImageUploadModal,
} from './components';

const ImagesManagementPage: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usageTypeFilter, setUsageTypeFilter] = useState<string>('all');
  const [storageTypeFilter, setStorageTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
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
  const fetchImages = async (params?: GetImageListReq) => {
    setLoading(true);
    try {
      const response = await GetImageList({
        page: pagination.current,
        page_size: pagination.pageSize,
        usage_type: usageTypeFilter === 'all' ? undefined : usageTypeFilter,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1],
        ...params,
      });

      if (response.code === 0 && response.data) {
        let imageList = response.data.items || [];

        // 客户端搜索过滤
        if (searchTerm) {
          imageList = imageList.filter((image) =>
            image.filename.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        }

        // 客户端存储类型过滤
        if (storageTypeFilter !== 'all') {
          imageList = imageList.filter(
            (image) => image.storage_type === storageTypeFilter,
          );
        }

        // 客户端排序
        imageList.sort((a, b) => {
          switch (sortBy) {
            case 'date':
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case 'size':
              return b.size - a.size;
            case 'name':
              return a.filename.localeCompare(b.filename);
            default:
              return 0;
          }
        });

        setImages(imageList);
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
        message.error(response.message || '获取图片列表失败');
      }
    } catch (error) {
      message.error('获取图片列表失败');
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
  };

  // 获取统计数据
  const [statistics, setStatistics] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStatistics = async () => {
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
  };

  // 初始化加载
  useEffect(() => {
    fetchImages();
    fetchStatistics();
  }, []);

  // 搜索和筛选变化时重新加载（防抖处理）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchImages({ page: 1, page_size: pagination.pageSize });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, usageTypeFilter, storageTypeFilter, dateRange, sortBy]);

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
  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  // 处理删除单个图片
  const handleDeleteImage = (image: ImageInfo) => {
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
          } else {
            message.error(response.message || '删除图片失败');
          }
        } catch (error) {
          message.error('删除图片失败');
          console.error('删除图片失败:', error);
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
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
          } else {
            message.error(response.message || '批量删除失败');
          }
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 处理查看详情
  const handleViewDetail = (image: ImageInfo) => {
    setSelectedImage(image);
    setIsDetailModalOpen(true);
  };

  // 处理下载图片
  const handleDownloadImage = (image: ImageInfo) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理批量选择
  const handleBatchSelect = (imageId: number, checked: boolean) => {
    if (checked) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map((image) => image.id));
    } else {
      setSelectedImages([]);
    }
  };

  // 处理表单提交成功
  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    fetchImages();
    fetchStatistics();
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: newPageSize,
    }));
    fetchImages({ page, page_size: newPageSize });
  };

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
    return date.toLocaleDateString('zh-CN');
  };

  // 获取使用类型标签颜色
  const getUsageTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      avatar: 'blue',
      cover: 'green',
      content: 'orange',
      other: 'gray',
    };
    return colorMap[type] || 'gray';
  };

  // 获取存储类型标签颜色
  const getStorageTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      local: 'purple',
      cos: 'cyan',
    };
    return colorMap[type] || 'gray';
  };

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
          <ImageFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={{
              usageType: usageTypeFilter,
              storageType: storageTypeFilter,
              dateRange: dateRange,
            }}
            onFilterChange={(filters) => {
              setUsageTypeFilter(filters.usageType);
              setStorageTypeFilter(filters.storageType);
              setDateRange(filters.dateRange);
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCount={selectedImages.length}
            totalCount={images.length}
            onSelectAll={handleSelectAll}
            onBatchDelete={handleBatchDelete}
          />
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
                <AnimatePresence>
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ delay: index * 0.05 }}
                      {...cardHover}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group"
                    >
                      {/* 批量选择复选框 */}
                      {batchMode && (
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox
                            checked={selectedImages.includes(image.id)}
                            onChange={(e) =>
                              handleBatchSelect(image.id, e.target.checked)
                            }
                            className="bg-white/80 backdrop-blur-sm rounded"
                          />
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <Tooltip title="查看详情">
                            <motion.button
                              {...hoverScale}
                              onClick={() => handleViewDetail(image)}
                              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-white/90 transition-colors"
                            >
                              <EyeOutlined className="text-gray-600" />
                            </motion.button>
                          </Tooltip>
                          <Tooltip title="下载图片">
                            <motion.button
                              {...hoverScale}
                              onClick={() => handleDownloadImage(image)}
                              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-white/90 transition-colors"
                            >
                              <DownloadOutlined className="text-gray-600" />
                            </motion.button>
                          </Tooltip>
                          <Tooltip title="删除图片">
                            <motion.button
                              {...hoverScale}
                              onClick={() => handleDeleteImage(image)}
                              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-md hover:bg-red-50 transition-colors"
                            >
                              <DeleteOutlined className="text-red-500" />
                            </motion.button>
                          </Tooltip>
                        </div>
                      </div>

                      {/* 图片展示 */}
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <motion.img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          loading="lazy"
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
                  ))}
                </AnimatePresence>
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
