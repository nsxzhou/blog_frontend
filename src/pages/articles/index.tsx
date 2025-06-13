import {
  DeleteArticle,
  GetArticles,
  GetArticleStats,
  UpdateArticleAccess,
  UpdateArticleStatus,
  type ArticleListItem,
  type ArticleStatsRes,
  type UnifiedArticleQuery,
} from '@/api/article';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/constants/animations';
import { history } from '@umijs/max';
import { message, Modal, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  ArticleActions,
  ArticleFilters,
  ArticleStats,
  ArticleTable,
  type FilterParams,
  type SortParams,
} from './components';

const ArticleManagementPage: React.FC = () => {
  // 状态管理
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statistics, setStatistics] = useState<ArticleStatsRes | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [batchMode, setBatchMode] = useState(false);

  // 分页和筛选参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [filters, setFilters] = useState<FilterParams>({
    keyword: '',
    status: '',
    category_id: undefined,
    tag_id: undefined,
    access_type: '',
    is_top: 2,
    is_original: 2,
    start_date: '',
    end_date: '',
    author_id: undefined,
  });

  const [sorting, setSorting] = useState<SortParams>({
    order_by: 'created_at',
    order: 'desc',
  });

  // 获取文章列表
  const fetchArticles = async (params?: Partial<UnifiedArticleQuery>) => {
    setLoading(true);
    try {
      const query: UnifiedArticleQuery = {
        page: pagination.current,
        page_size: pagination.pageSize,
        keyword: filters.keyword || undefined,
        // 字符串状态字段：不传则获取所有
        status: filters.status === '' ? '' : (filters.status as any),
        category_id: filters.category_id,
        tag_id: filters.tag_id,
        // 字符串状态字段：不传则获取所有
        access_type:
          filters.access_type === '' ? '' : (filters.access_type as any),
        // 数字状态字段：传2获取全部，传具体值获取对应状态
        is_top: filters.is_top === 2 ? 2 : (filters.is_top as any),
        is_original:
          filters.is_original === 2 ? 2 : (filters.is_original as any),
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        author_id: filters.author_id,
        sort_by: sorting.order_by as any,
        order: sorting.order,
        ...params,
      };

      const response = await GetArticles(query);

      if (response.code === 0 && response.data) {
        setArticles(response.data.list || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          current: params?.page || pagination.current,
        }));
      } else {
        setArticles([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 1,
        }));
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    setStatsLoading(true);
    try {
      const response = await GetArticleStats();
      if (response.code === 0) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchArticles();
    fetchStatistics();
  }, []);

  // 筛选和排序变化时重新获取数据
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchArticles({ page: 1 });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, sorting]);

  // 处理筛选变化
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 处理排序变化
  const handleSortChange = (newSorting: SortParams) => {
    setSorting(newSorting);
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    };
    setPagination(newPagination);
    fetchArticles({ page, page_size: newPagination.pageSize });
  };

  // 文章操作处理
  const handleEdit = (id: number) => {
    history.push(`/write?id=${id}`);
  };

  const handleView = (id: number) => {
    history.push(`/article-detail/${id}`);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作无法撤销。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await DeleteArticle(id);
          if (response.code === 0) {
            message.success('文章删除成功');
            fetchArticles();
            fetchStatistics();
          }
        } catch (error) {
          console.error('删除文章失败:', error);
        }
      },
    });
  };

  const handleStatusChange = async (
    id: number,
    status: 'draft' | 'published',
  ) => {
    try {
      const response = await UpdateArticleStatus(id, { status });
      if (response.code === 0) {
        message.success('状态更新成功');
        fetchArticles();
        fetchStatistics();
      }
    } catch (error) {
      console.error('状态更新失败:', error);
    }
  };

  const handleAccessChange = async (
    id: number,
    access_type: 'public' | 'private' | 'password',
    password?: string,
  ) => {
    try {
      const response = await UpdateArticleAccess(id, { access_type, password });
      if (response.code === 0) {
        message.success('访问权限更新成功');
        fetchArticles();
      }
    } catch (error) {
      console.error('访问权限更新失败:', error);
    }
  };

  // 批量操作处理
  const handleBatchDelete = () => {
    if (selectedArticles.length === 0) {
      message.warning('请先选择要删除的文章');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedArticles.length} 篇文章吗？此操作无法撤销。`,
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await Promise.all(selectedArticles.map((id) => DeleteArticle(id)));
          message.success('批量删除成功');
          setSelectedArticles([]);
          setBatchMode(false);
          fetchArticles();
          fetchStatistics();
        } catch (error) {
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  const handleBatchStatusChange = async (status: 'draft' | 'published') => {
    if (selectedArticles.length === 0) {
      message.warning('请先选择要操作的文章');
      return;
    }

    try {
      await Promise.all(
        selectedArticles.map((id) => UpdateArticleStatus(id, { status })),
      );
      message.success('批量状态更新成功');
      setSelectedArticles([]);
      setBatchMode(false);
      fetchArticles();
      fetchStatistics();
    } catch (error) {
      console.error('批量状态更新失败:', error);
    }
  };

  const handleCreateNew = () => {
    history.push('/write');
  };

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
          {/* 页面标题 */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
                <p className="mt-2 text-gray-600">
                  管理系统中的所有文章，包括查看、编辑、删除、状态管理等操作
                </p>
              </div>
            </div>
          </motion.div>

          {/* 统计卡片 */}
          <motion.div variants={itemVariants}>
            <ArticleStats statistics={statistics} loading={statsLoading} />
          </motion.div>

          {/* 筛选和操作栏 */}
          <motion.div variants={itemVariants}>
            <ArticleFilters
              filters={filters}
              sorting={sorting}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onCreateNew={handleCreateNew}
            />
          </motion.div>

          {/* 批量操作栏 */}
          <motion.div variants={itemVariants}>
            <ArticleActions
              batchMode={batchMode}
              selectedCount={selectedArticles.length}
              onToggleBatchMode={() => setBatchMode(!batchMode)}
              onBatchDelete={handleBatchDelete}
              onBatchStatusChange={handleBatchStatusChange}
              onClearSelection={() => setSelectedArticles([])}
            />
          </motion.div>

          {/* 文章表格 */}
          <motion.div variants={itemVariants}>
            <Spin spinning={loading}>
              <ArticleTable
                articles={articles}
                batchMode={batchMode}
                selectedArticles={selectedArticles}
                pagination={pagination}
                onSelectionChange={setSelectedArticles}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onAccessChange={handleAccessChange}
              />
            </Spin>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArticleManagementPage;
