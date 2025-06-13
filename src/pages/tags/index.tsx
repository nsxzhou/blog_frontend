import {
  DeleteTag,
  GetTagList,
  SyncArticleCount,
  type GetTagListReq,
  type TagInfo,
} from '@/api/tag';
import {
  cardHover,
  containerVariants,
  fadeInUp,
  hoverScale,
  itemVariants,
} from '@/constants/animations';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Button, Empty, message, Modal, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import SearchAndFilter from './components/SearchAndFilter';
import TagForm from './components/TagForm';
import TagStats from './components/TagStats';

const TagManagementPage: React.FC = () => {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagInfo | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 16,
    total: 0,
  });

  // 获取标签列表
  const fetchTags = async (params?: GetTagListReq) => {
    setLoading(true);
    try {
      const response = await GetTagList({
        page: pagination.current,
        page_size: pagination.pageSize,
        keyword: searchTerm || undefined,
        ...params,
      });

      if (response.code === 0 && response.data) {
        // 确保 tags 数组存在
        const tags = response.data.list || [];
        setTags(tags);

        // 安全地处理分页信息
        if (response.data.total) {
          setPagination((prev) => ({
            ...prev,
            total: response.data.total || 0,
            current: params?.page || pagination.current,
          }));
        } else {
          // 如果没有分页信息，使用默认值
          setPagination((prev) => ({
            ...prev,
            total: tags.length,
            current: 1,
          }));
        }
      } else {
        // 处理响应失败的情况
        setTags([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 1,
        }));
      }
    } catch (error) {
      console.error('获取标签列表失败:', error);
      // 重置状态
      setTags([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        current: 1,
      }));
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchTags();
  }, []);

  // 搜索变化时重新加载（防抖处理）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchTags({ page: 1, page_size: pagination.pageSize });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 计算统计数据
  const stats = useMemo(() => {
    const total = tags.length;
    const recentlyAdded = tags.filter((tag) => {
      const createDate = new Date(tag.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createDate > weekAgo;
    }).length;

    return {
      total,
      recentlyAdded,
      // 按创建时间排序，获取最热门的标签（这里简化为最新的）
      popular: Math.min(total, 10),
    };
  }, [tags]);

  // 处理创建标签
  const handleCreateTag = () => {
    setEditingTag(null);
    setIsFormModalOpen(true);
  };

  // 处理编辑标签
  const handleEditTag = (tag: TagInfo) => {
    setEditingTag(tag);
    setIsFormModalOpen(true);
  };

  // 处理删除标签
  const handleDeleteTag = (tag: TagInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除标签"${tag.name}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await DeleteTag(tag.id);
          if (response.code === 0) {
            message.success('标签删除成功');
            fetchTags();
          }
        } catch (error) {
          console.error('删除标签失败:', error);
        }
      },
    });
  };

  // 处理表单提交成功
  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingTag(null);
    fetchTags();
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: newPageSize,
    }));
    fetchTags({ page, page_size: newPageSize });
  };

  const handleSyncArticleCount = async () => {
    const response = await SyncArticleCount();
    if (response.code === 0) {
      message.success('同步文章数量成功');
      fetchTags();
    }
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
                <TagsOutlined className="text-blue-600" />
                标签管理
              </h1>
              <p className="text-gray-600 mt-2">管理博客标签，优化内容分类</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSyncArticleCount} type="default">
                <SyncOutlined />
                同步文章标签
              </Button>
              <motion.button
                {...hoverScale}
                onClick={handleCreateTag}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <PlusOutlined />
                创建标签
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div variants={itemVariants} className="mb-8">
          <TagStats stats={stats} />
        </motion.div>

        {/* 搜索 */}
        <motion.div variants={itemVariants} className="mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </motion.div>

        {/* 标签列表 */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
              <p className="text-gray-600 mt-4">加载中...</p>
            </div>
          ) : tags.length === 0 ? (
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-xl p-12 text-center shadow-sm"
            >
              <Empty
                description="暂无标签"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <motion.button
                  {...hoverScale}
                  onClick={handleCreateTag}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  创建第一个标签
                </motion.button>
              </Empty>
            </motion.div>
          ) : (
            <>
              {/* 标签网格 */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                variants={containerVariants}
              >
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    variants={itemVariants}
                    custom={index}
                    {...cardHover}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    {/* 标签内容 */}
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏷️</div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                        {tag.name}
                      </h3>
                      <div className="text-xs text-blue-600 mb-1 font-medium">
                        {tag.article_count} 篇文章
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {new Date(tag.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditTag(tag)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <EditOutlined className="text-xs" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTag(tag)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <DeleteOutlined className="text-xs" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* 分页 */}
              {pagination.total > pagination.pageSize && (
                <motion.div {...fadeInUp} className="mt-8 flex justify-center">
                  <div className="bg-white rounded-lg px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <button
                        disabled={pagination.current === 1}
                        onClick={() => handlePageChange(pagination.current - 1)}
                        className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        上一页
                      </button>
                      <span className="text-gray-600">
                        第 {pagination.current} 页，共{' '}
                        {Math.ceil(pagination.total / pagination.pageSize)} 页
                      </span>
                      <button
                        disabled={
                          pagination.current >=
                          Math.ceil(pagination.total / pagination.pageSize)
                        }
                        onClick={() => handlePageChange(pagination.current + 1)}
                        className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        下一页
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* 标签表单模态框 */}
      <Modal
        title={editingTag ? '编辑标签' : '创建标签'}
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        footer={null}
        width={500}
      >
        <TagForm
          tag={editingTag}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default TagManagementPage;
