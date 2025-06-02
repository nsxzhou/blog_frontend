import {
  DeleteArticle,
  GetArticleStats,
  GetMyArticles,
  type ArticleListItem,
} from '@/api/article';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/constants/animations';
import BlogCard from '@/pages/blog/components/BlogCard';
import type { BlogPost } from '@/pages/blog/components/types';
import { history, useRequest } from '@umijs/max';
import { Empty, Pagination, Spin, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import {
  ArticleControls,
  StatsCards,
  type ArticleStats,
  type FilterType,
  type SortType,
} from './components';
import { EmptyState } from './components/EmptyState';

// 将 API 返回的文章数据转换为 BlogCard 需要的格式
const convertToBlogPost = (apiArticle: ArticleListItem): BlogPost => {
  return {
    id: apiArticle.id,
    title: apiArticle.title,
    excerpt: apiArticle.summary,
    image: apiArticle.cover_image || '/default-cover.jpg',
    date: new Date(
      apiArticle.published_at || apiArticle.created_at,
    ).toLocaleDateString(),
    views: apiArticle.view_count,
    likes: apiArticle.like_count,
    comments: apiArticle.comment_count,
    tags: apiArticle.tags.map((tag) => tag.name),
    category: apiArticle.category_name,
    author: {
      name: apiArticle.author_name || '匿名用户',
    },
    featured: apiArticle.is_top === 1,
  };
};

const MyArticlesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('');
  const [sortType, setSortType] = useState<SortType>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // 调整为3的倍数，适配网格布局

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
        status: filterType === '' ? '' : (filterType as any),
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

  // 转换文章数据为 BlogPost 格式
  const blogPosts = useMemo(() => {
    if (!articlesData?.list) return [];
    return articlesData.list.map(convertToBlogPost);
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
    const published = blogPosts.filter((post) => post.featured !== undefined);
    return {
      totalArticles: blogPosts.length,
      totalViews: blogPosts.reduce((sum, post) => sum + post.views, 0),
      totalLikes: blogPosts.reduce((sum, post) => sum + post.likes, 0),
      totalComments: blogPosts.reduce((sum, post) => sum + post.comments, 0),
      publishedCount: published.length,
      draftCount: blogPosts.length - published.length,
    };
  }, [statsData, blogPosts]);

  // 处理搜索和过滤变化
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: FilterType) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortType) => {
    setSortType(value);
    setCurrentPage(1);
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
      refreshArticles();
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

  const loading = articlesLoading || statsLoading;

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
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">我的文章</h1>
            <p className="text-lg text-gray-600">管理和查看您的创作内容</p>
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

          {/* 文章网格 */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : blogPosts.length === 0 ? (
              searchTerm || filterType !== '' ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="没有找到符合条件的文章"
                    className="text-gray-500"
                  />
                </motion.div>
              ) : (
                <EmptyState onCreateClick={handleCreateNew} />
              )
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                >
                  {blogPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </motion.div>

                {/* 分页 */}
                {articlesData && articlesData.total > pageSize && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center"
                  >
                    <Pagination
                      current={currentPage}
                      total={articlesData.total}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条文章`
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

export default MyArticlesPage;
