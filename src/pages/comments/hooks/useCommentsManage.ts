import { GetArticles, type ArticleListItem } from '@/api/article';
import {
  BatchUpdateCommentStatus,
  DeleteComment,
  GetCommentList,
  UpdateCommentStatus,
  type CommentItem,
} from '@/api/comment';
import { useRequest } from '@umijs/max';
import { message, Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import type {
  BatchAction,
  FilterType,
  ManageComment,
  SortType,
  ViewMode,
} from '../types';

interface globalStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  likes: number;
}

interface UseCommentsManageState {
  // 基础状态
  viewMode: ViewMode;
  selectedArticle: ArticleListItem | null;

  // 搜索和过滤
  searchTerm: string;
  filterType: FilterType;
  sortType: SortType;
  selectedCommentIds: number[];

  // 分页
  currentPage: number;
  pageSize: number;

  // 数据
  articles: ArticleListItem[];
  comments: ManageComment[];
  articleStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };
  commentStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };

  // 加载状态
  loading: boolean;

  // 操作方法
  setViewMode: (mode: ViewMode) => void;
  setSearchTerm: (term: string) => void;
  setFilterType: (type: FilterType) => void;
  setSortType: (type: SortType) => void;
  setCurrentPage: (page: number) => void;

  handleSelectArticle: (article: ArticleListItem) => void;
  handleBackToArticles: () => void;
  handleSelectComment: (id: number, selected: boolean) => void;
  handleSelectAll: (selected: boolean) => void;
  handleApprove: (id: number) => Promise<void>;
  handleReject: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleBatchAction: (action: BatchAction) => Promise<void>;

  // 数据总数
  total: number;
}

export const useCommentsManage = (): UseCommentsManageState => {
  // 基础状态
  const [viewMode, setViewMode] = useState<ViewMode>('articles');
  const [selectedArticle, setSelectedArticle] =
    useState<ArticleListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('');
  const [sortType, setSortType] = useState<SortType>('date');
  const [selectedCommentIds, setSelectedCommentIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [globalStats, setGlobalStats] = useState<globalStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    likes: 0,
  });

  // 获取文章列表
  const {
    data: articlesData,
    loading: articlesLoading,
    refresh: refreshArticles,
  } = useRequest(
    () =>
      GetArticles({
        page: currentPage,
        page_size: pageSize,
        keyword: searchTerm || undefined,
        status: 'published',
        sort_by: 'published_at',
        order: 'desc',
      }),
    {
      refreshDeps: [currentPage, pageSize, searchTerm],
      ready: viewMode === 'articles',
    },
  );

  // 获取全局评论统计 - 优化为只获取基本统计信息
  useRequest(
    async () => {
      // 获取各种状态的评论数量
      const [approvedData, pendingData, rejectedData] = await Promise.all([
        GetCommentList({
          page: 1,
          page_size: 1, // 只获取第一条来获取总数
          status: 'approved',
          order_by: 'created_at',
          order: 'desc',
        }),
        GetCommentList({
          page: 1,
          page_size: 1,
          status: 'pending',
          order_by: 'created_at',
          order: 'desc',
        }),
        GetCommentList({
          page: 1,
          page_size: 1,
          status: 'rejected',
          order_by: 'created_at',
          order: 'desc',
        }),
      ]);

      // 获取总评论数
      const totalData = await GetCommentList({
        page: 1,
        page_size: 1,
        order_by: 'created_at',
        order: 'desc',
      });

      const stats = {
        total: totalData.data?.total || 0,
        approved: approvedData.data?.total || 0,
        pending: pendingData.data?.total || 0,
        rejected: rejectedData.data?.total || 0,
        likes: 0,
      };

      setGlobalStats(stats);
      return stats;
    }
  );

  // 获取特定文章的评论
  const {
    data: commentsData,
    loading: commentsLoading,
    refresh: refreshComments,
  } = useRequest(
    () => {
      if (!selectedArticle) return Promise.resolve(null);
      return GetCommentList({
        article_id: selectedArticle.id,
        page: currentPage,
        page_size: pageSize,
        status: filterType || undefined,
        order_by: 'created_at',
        order: 'desc',
      });
    },
    {
      refreshDeps: [selectedArticle, currentPage, pageSize, filterType],
      ready: !!selectedArticle && viewMode === 'comments',
    },
  );

  // 处理过滤的文章列表
  const filteredArticles = useMemo(() => {
    if (viewMode !== 'articles' || !articlesData?.list) return [];
    if (!searchTerm.trim()) return articlesData.list;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return articlesData.list.filter(
      (article: ArticleListItem) =>
        article.title.toLowerCase().includes(lowerSearchTerm) ||
        (article.summary &&
          article.summary.toLowerCase().includes(lowerSearchTerm)) ||
        (article.author_name &&
          article.author_name.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [articlesData, searchTerm, viewMode]);

  // 处理过滤的评论列表
  const filteredComments = useMemo(() => {
    if (!commentsData?.list || !selectedArticle) return [];

    const comments = commentsData.list.map(
      (comment: CommentItem): ManageComment => ({
        ...comment,
        articleTitle: selectedArticle.title,
        articleId: comment.article_id,
        user_name:
          comment.user?.nickname || comment.user?.username || '匿名用户',
        user_email: comment.user?.username || '',
      }),
    );

    if (!searchTerm.trim()) return comments;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return comments.filter(
      (comment: ManageComment) =>
        comment.content.toLowerCase().includes(lowerSearchTerm) ||
        (comment.user_name &&
          comment.user_name.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [commentsData, selectedArticle, searchTerm]);

  // 全局统计数据
  const articleStats = useMemo(() => {
    if (!globalStats) {
      return { total: 0, approved: 0, pending: 0, rejected: 0, likes: 0 };
    }

    return {
      total: globalStats?.total || 0,
      approved: globalStats.approved || 0,
      pending: globalStats.pending || 0,
      rejected: globalStats.rejected || 0,
      likes: globalStats.likes || 0,
    };
  }, [globalStats]);

  // 当前文章评论统计
  const commentStats = useMemo(() => {
    if (!filteredComments.length) {
      return { total: 0, approved: 0, pending: 0, rejected: 0, likes: 0 };
    }
    return {
      total: filteredComments.length,
      approved: filteredComments.filter(
        (c: ManageComment) => c.status === 'approved',
      ).length,
      pending: filteredComments.filter(
        (c: ManageComment) => c.status === 'pending',
      ).length,
      rejected: filteredComments.filter(
        (c: ManageComment) => c.status === 'rejected',
      ).length,
      likes: filteredComments.reduce(
        (sum: number, c: ManageComment) => sum + (c.like_count || 0),
        0,
      ),
    };
  }, [filteredComments]);

  // 处理文章选择
  const handleSelectArticle = useCallback((article: ArticleListItem) => {
    setSelectedArticle(article);
    setViewMode('comments');
    setCurrentPage(1);
    setSelectedCommentIds([]);
    setFilterType('');
    setSortType('date');
    setSearchTerm('');
  }, []);

  // 返回文章列表
  const handleBackToArticles = useCallback(() => {
    setViewMode('articles');
    setSelectedArticle(null);
    setSelectedCommentIds([]);
    setCurrentPage(1);
    setSearchTerm('');
  }, []);

  // 处理评论选择
  const handleSelectComment = useCallback((id: number, selected: boolean) => {
    if (selected) {
      setSelectedCommentIds((prev) => [...prev, id]);
    } else {
      setSelectedCommentIds((prev) =>
        prev.filter((selectedId) => selectedId !== id),
      );
    }
  }, []);

  // 处理全选
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedCommentIds(
          filteredComments.map((comment: ManageComment) => comment.id),
        );
      } else {
        setSelectedCommentIds([]);
      }
    },
    [filteredComments],
  );

  // 评论操作
  const handleApprove = useCallback(
    async (id: number) => {
      try {
        await UpdateCommentStatus(id, { status: 'approved' });
        message.success('评论审核通过');
        refreshComments();
      } catch (error) {
        message.error('操作失败');
      }
    },
    [refreshComments],
  );

  const handleReject = useCallback(
    async (id: number) => {
      try {
        await UpdateCommentStatus(id, { status: 'rejected' });
        message.success('评论已拒绝');
        refreshComments();
      } catch (error) {
        message.error('操作失败');
      }
    },
    [refreshComments],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条评论吗？此操作无法撤销。',
        okText: '确认删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            await DeleteComment(id);
            message.success('评论删除成功');
            refreshComments();
          } catch (error) {
            message.error('删除失败');
          }
        },
      });
    },
    [refreshComments],
  );

  const handleBatchAction = useCallback(
    async (action: BatchAction) => {
      if (selectedCommentIds.length === 0) {
        message.warning('请先选择要操作的评论');
        return;
      }

      try {
        if (action === 'delete') {
          Modal.confirm({
            title: '确认批量删除',
            content: `确定要删除选中的 ${selectedCommentIds.length} 条评论吗？此操作无法撤销。`,
            okText: '确认删除',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
              for (const id of selectedCommentIds) {
                await DeleteComment(id);
              }
              message.success('批量删除成功');
              setSelectedCommentIds([]);
              refreshComments();
            },
          });
        } else {
          const status = action === 'approve' ? 'approved' : 'rejected';
          await BatchUpdateCommentStatus({ ids: selectedCommentIds, status });
          message.success(`批量${action === 'approve' ? '通过' : '拒绝'}成功`);
          setSelectedCommentIds([]);
          refreshComments();
        }
      } catch (error) {
        message.error('批量操作失败');
      }
    },
    [selectedCommentIds, refreshComments],
  );

  return {
    // 基础状态
    viewMode,
    selectedArticle,
    searchTerm,
    filterType,
    sortType,
    selectedCommentIds,
    currentPage,
    pageSize,

    // 数据
    articles: filteredArticles,
    comments: filteredComments,
    articleStats,
    commentStats,

    // 加载状态
    loading: articlesLoading || commentsLoading,

    // 总数
    total:
      viewMode === 'articles'
        ? articlesData?.total || 0
        : commentsData?.total || 0,

    // 方法
    setViewMode,
    setSearchTerm,
    setFilterType,
    setSortType,
    setCurrentPage,
    handleSelectArticle,
    handleBackToArticles,
    handleSelectComment,
    handleSelectAll,
    handleApprove,
    handleReject,
    handleDelete,
    handleBatchAction,
  };
};
