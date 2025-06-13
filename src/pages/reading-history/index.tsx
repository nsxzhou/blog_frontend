import {
  BatchDeleteReadingHistory,
  ClearReadingHistory,
  DeleteReadingHistory,
  GetReadingHistory,
} from '@/api/reading-history';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/constants/animations';
import { useRequest } from '@umijs/max';
import { message, Modal, Pagination, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  EmptyState,
  ReadingHistoryCard,
  ReadingHistoryHeader,
} from './components/index';

const ReadingHistoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // 获取阅读历史列表
  const {
    data: historyData,
    loading: historyLoading,
    run: loadHistory,
  } = useRequest(
    (page: number, size: number) =>
      GetReadingHistory({
        page,
        page_size: size,
        order: 'desc',
      }),
    {
      manual: true,
      onError: (error) => {
        console.error('获取阅读历史失败:', error);
      },
    },
  );

  // 删除单个记录
  const { run: deleteSingle, loading: deleteLoading } = useRequest(
    DeleteReadingHistory,
    {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
        loadHistory(currentPage, pageSize);
      },
      onError: (error) => {
        console.error('删除失败:', error);
      },
    },
  );

  // 批量删除记录
  const { run: batchDelete, loading: batchDeleteLoading } = useRequest(
    BatchDeleteReadingHistory,
    {
      manual: true,
      onSuccess: () => {
        message.success('批量删除成功');
        setSelectedIds([]);
        setIsSelectionMode(false);
        loadHistory(currentPage, pageSize);
      },
      onError: (error) => {
        console.error('批量删除失败:', error);
      },
    },
  );

  // 清空所有记录
  const { run: clearAll, loading: clearLoading } = useRequest(
    ClearReadingHistory,
    {
      manual: true,
      onSuccess: () => {
        message.success('清空成功');
        loadHistory(currentPage, pageSize);
      },
      onError: (error) => {
        console.error('清空失败:', error);
      },
    },
  );

  // 初始化加载数据
  React.useEffect(() => {
    loadHistory(currentPage, pageSize);
  }, [currentPage, pageSize, loadHistory]);

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
    loadHistory(page, pageSize);
  };

  // 处理单个删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条阅读记录吗？',
      onOk: () => deleteSingle(id),
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedIds.length} 条阅读记录吗？`,
      onOk: () => batchDelete({ ids: selectedIds }),
    });
  };

  // 处理清空所有
  const handleClearAll = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有阅读历史吗？此操作不可恢复。',
      okType: 'danger',
      onOk: () => clearAll(),
    });
  };

  // 处理选择
  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(historyData?.list.map((item) => item.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const totalCount = historyData?.total || 0;
  const displayItems = historyData?.list || [];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 页面头部 */}
          <motion.div variants={itemVariants}>
            <ReadingHistoryHeader
              totalCount={totalCount}
              selectedCount={selectedIds.length}
              isSelectionMode={isSelectionMode}
              onToggleSelectionMode={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
              }}
              onSelectAll={handleSelectAll}
              onBatchDelete={handleBatchDelete}
              onClearAll={handleClearAll}
              batchDeleteLoading={batchDeleteLoading}
              clearLoading={clearLoading}
            />
          </motion.div>

          {/* 阅读历史列表 */}
          <motion.div variants={itemVariants}>
            {historyLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="text-gray-600 mt-4">加载中...</p>
                </div>
              </div>
            ) : displayItems.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* 结果统计 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="text-sm text-gray-600">
                    共有{' '}
                    <span className="font-medium text-gray-900">
                      {totalCount}
                    </span>{' '}
                    条阅读记录
                    {totalCount > 0 && (
                      <>
                        ，当前显示第{' '}
                        <span className="font-medium text-blue-600">
                          {(currentPage - 1) * pageSize + 1}
                        </span>{' '}
                        -{' '}
                        <span className="font-medium text-blue-600">
                          {Math.min(currentPage * pageSize, totalCount)}
                        </span>{' '}
                        条
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  {displayItems.map((item, index) => (
                    <ReadingHistoryCard
                      key={item.id}
                      item={item}
                      index={index}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedIds.includes(item.id)}
                      onSelect={handleSelect}
                      onDelete={handleDelete}
                      deleteLoading={deleteLoading}
                    />
                  ))}
                </motion.div>

                {/* 分页 */}
                {totalCount > pageSize && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center"
                  >
                    <Pagination
                      current={currentPage}
                      total={totalCount}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                      }
                      className="select-none"
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReadingHistoryPage;
