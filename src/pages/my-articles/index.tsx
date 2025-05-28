import {
  DeleteArticle,
  GetArticleStats,
  GetMyArticles,
  type ArticleListItem,
} from '@/api/article';
import { containerVariants, itemVariants } from '@/constants';
import { history, useRequest } from '@umijs/max';
import { Empty, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import {
  ArticleControls,
  ArticleList,
  StatsCards,
  type ArticleStats,
  type FilterType,
  type MyArticle,
  type SortType,
} from './components';
import { EmptyState } from './components/EmptyState';

// 将 API 返回的文章数据转换为组件需要的格式
const convertArticleData = (apiArticle: ArticleListItem): MyArticle => {
  return {
    id: apiArticle.id,
    title: apiArticle.title,
    excerpt: apiArticle.summary,
    image: apiArticle.cover_image,
    date: apiArticle.published_at || apiArticle.created_at,
    lastModified: apiArticle.updated_at,
    readTime: `${Math.ceil(apiArticle.word_count / 200)} 分钟`,
    views: apiArticle.view_count,
    likes: apiArticle.like_count,
    comments: apiArticle.comment_count,
    tags: apiArticle.tags.map((tag) => tag.name),
    category: apiArticle.category_name,
    status: apiArticle.status as 'published' | 'draft',
    featured: apiArticle.is_top === 1,
  };
};

const MyArticlesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // 设置为20，小于后端限制的50

  // 获取我的文章列表
  const {
    data: articlesData,
    loading: articlesLoading,
    refresh: refreshArticles,
  } = useRequest(
    () => {
      return GetMyArticles({
        page: currentPage,
        page_size: pageSize,
        keyword: searchTerm || undefined,
        status: filterType === 'all' ? undefined : filterType,
        order_by:
          sortType === 'date'
            ? 'published_at'
            : sortType === 'views'
            ? 'view_count'
            : sortType === 'likes'
            ? 'like_count'
            : 'title',
        order: sortType === 'title' ? 'asc' : 'desc',
        is_original: 1,
      });
    },
    {
      refreshDeps: [currentPage, pageSize, searchTerm, filterType, sortType],
      onError: (error) => {
        console.error('获取文章列表失败:', error);
        message.error('获取文章列表失败，请稍后重试');
      },
    },
  );

  // 获取文章统计数据
  const { data: statsData, loading: statsLoading } = useRequest(
    () => GetArticleStats(),
    {
      onError: (error) => {
        console.error('获取统计数据失败:', error);
      },
    },
  );

  // 转换文章数据
  const articles = useMemo(() => {
    if (!articlesData?.list) return [];
    return articlesData.list.map(convertArticleData);
  }, [articlesData]);

  // 计算统计数据
  const stats: ArticleStats = useMemo(() => {
    if (statsData) {
      return {
        totalArticles: statsData.total_articles,
        totalViews: statsData.total_views,
        totalLikes: statsData.total_likes,
        totalComments: statsData.total_comments,
        publishedCount: statsData.published_articles,
        draftCount: statsData.draft_articles,
      };
    }

    // 如果统计接口失败，从文章列表计算（注意：这里只是当前页的数据）
    const publishedArticles = articles.filter(
      (article: MyArticle) => article.status === 'published',
    );
    const draftArticles = articles.filter(
      (article: MyArticle) => article.status === 'draft',
    );

    return {
      totalArticles: articles.length,
      totalViews: articles.reduce(
        (sum: number, article: MyArticle) => sum + article.views,
        0,
      ),
      totalLikes: articles.reduce(
        (sum: number, article: MyArticle) => sum + article.likes,
        0,
      ),
      totalComments: articles.reduce(
        (sum: number, article: MyArticle) => sum + article.comments,
        0,
      ),
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
    };
  }, [statsData, articles]);

  // 处理搜索和过滤变化
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleFilterChange = (value: FilterType) => {
    setFilterType(value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleSortChange = (value: SortType) => {
    setSortType(value);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理操作
  const handleCreateNew = () => {
    history.push('/write');
  };

  const handleEdit = (id: number) => {
    history.push(`/write?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteArticle(id);
      message.success('文章删除成功');
      refreshArticles(); // 刷新文章列表
    } catch (error) {
      console.error('删除文章失败:', error);
      message.error('删除文章失败，请稍后重试');
    }
  };

  const handleShare = (id: number) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/article-detail/${id}`,
    );
    message.success('链接已复制到剪贴板');
  };

  const handleArticleClick = (id: number) => {
    history.push(`/article-detail/${id}`);
  };

  const loading = articlesLoading || statsLoading;

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
          <h1 className="text-3xl font-bold text-gray-900">我的文章</h1>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div variants={itemVariants}>
          <StatsCards stats={stats} />
        </motion.div>

        {/* 控制栏 */}
        <motion.div variants={itemVariants}>
          <ArticleControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filterType={filterType}
            onFilterChange={handleFilterChange}
            sortType={sortType}
            onSortChange={handleSortChange}
            totalCount={articlesData?.total || 0}
            onCreateNew={handleCreateNew}
          />
        </motion.div>

        {/* 文章列表 */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : articles.length === 0 ? (
            searchTerm || filterType !== 'all' ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="没有找到符合条件的文章"
                className="py-20"
              />
            ) : (
              <EmptyState onCreateClick={handleCreateNew} />
            )
          ) : (
            <>
              <ArticleList
                articles={articles}
                loading={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
                onArticleClick={handleArticleClick}
              />

              {/* 分页组件 */}
              {articlesData && articlesData.total > pageSize && (
                <div className="flex justify-center mt-8">
                  <div className="bg-white px-4 py-3 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        上一页
                      </button>

                      <span className="px-4 py-2 text-sm text-gray-700">
                        第 {currentPage} 页，共{' '}
                        {Math.ceil(articlesData.total / pageSize)} 页
                      </span>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage >=
                          Math.ceil(articlesData.total / pageSize)
                        }
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        下一页
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyArticlesPage;
