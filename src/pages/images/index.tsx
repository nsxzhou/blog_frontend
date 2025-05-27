import { GetImageList, GetImageStatistics, type ImageInfo } from '@/api/image';
import { itemVariants, pageVariants } from '@/constants/animations';
import { useRequest } from '@umijs/max';
import { Card, Empty, Input, Pagination, Select, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

const { Search } = Input;

// 临时类型定义
interface FilterOptions {
  usageType: string;
  storageType: string;
  dateRange: [string, string] | null;
}

type SortType = 'date' | 'size' | 'name';

const ImagesPage: React.FC = () => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState<SortType>('date');

  // API 请求
  const {
    data: imageListData,
    loading: imagesLoading,
    refresh: refreshImages,
  } = useRequest(
    () =>
      GetImageList({
        page: currentPage,
        page_size: pageSize,
      }),
    {
      refreshDeps: [currentPage, pageSize],
    },
  );

  const { data: statsData, loading: statsLoading } =
    useRequest(GetImageStatistics);

  // 获取图片列表和分页信息
  const images = (imageListData as any)?.data?.images || [];
  const pagination = (imageListData as any)?.data?.pagination;
  const statistics = (statsData as any)?.data?.statistics;

  // 过滤和排序图片
  const filteredImages = useMemo(() => {
    let filtered = images.filter((image: ImageInfo) => {
      const matchesSearch =
        image.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.filename.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // 排序逻辑
    switch (sortBy) {
      case 'date':
        filtered.sort(
          (a: ImageInfo, b: ImageInfo) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case 'size':
        filtered.sort((a: ImageInfo, b: ImageInfo) => b.size - a.size);
        break;
      case 'name':
        filtered.sort((a: ImageInfo, b: ImageInfo) =>
          a.original_name.localeCompare(b.original_name),
        );
        break;
    }

    return filtered;
  }, [images, searchTerm, sortBy]);

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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">图片管理</h1>
              <p className="mt-2 text-gray-600">管理和组织您的图片资源</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              上传图片
            </motion.button>
          </div>
        </motion.div>

        {/* 统计信息 */}
        {statistics && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.total_images}
                </div>
                <div className="text-gray-600">图片总数</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(statistics.total_size)}
                </div>
                <div className="text-gray-600">总存储空间</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(statistics.by_usage_type).length}
                </div>
                <div className="text-gray-600">使用类型</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(statistics.by_storage_type).length}
                </div>
                <div className="text-gray-600">存储类型</div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* 搜索和过滤 */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              <Search
                placeholder="搜索图片名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                className="flex-1"
              />
              <Select value={sortBy} onChange={setSortBy} className="w-32">
                <Select.Option value="date">按日期</Select.Option>
                <Select.Option value="size">按大小</Select.Option>
                <Select.Option value="name">按名称</Select.Option>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* 图片网格 */}
        <motion.div variants={itemVariants}>
          {imagesLoading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredImages.length === 0 ? (
            <Card>
              <Empty
                description="暂无图片"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {filteredImages.map((image: ImageInfo) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.original_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                        {image.original_name}
                      </h3>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatFileSize(image.size)}</span>
                        <span>{formatDate(image.created_at)}</span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {image.usage_type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 分页 */}
              {pagination && pagination.total > pageSize && (
                <div className="flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={pagination.total}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 项，共 ${total} 项`
                    }
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImagesPage;
