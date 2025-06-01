import {
  ArticleAction,
  GetFavoriteArticles,
  type ArticleListItem,
} from '@/api/article';
import {
  containerVariants,
  itemVariants,
  pageVariants,
  simpleFadeIn,
} from '@/constants/animations';
import { history, useRequest } from '@umijs/max';
import { message, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { EmptyState, FavoriteHeader, FavoriteList } from './components';
import FavoriteFilters, {
  FilterType,
  SortType,
} from './components/FavoriteFilters';

// 转换API数据格式
const convertArticleData = (apiArticle: ArticleListItem): ArticleListItem => {
  return {
    id: apiArticle.id,
    title: apiArticle.title,
    summary: apiArticle.summary,
    cover_image: apiArticle.cover_image,
    author_name: apiArticle.author_name,
    author_id: apiArticle.author_id,
    category_name: apiArticle.category_name,
    category_id: apiArticle.category_id,
    tags: apiArticle.tags,
    view_count: apiArticle.view_count,
    like_count: apiArticle.like_count,
    comment_count: apiArticle.comment_count,
    favorite_count: apiArticle.favorite_count,
    published_at: apiArticle.published_at,
    created_at: apiArticle.created_at,
    updated_at: apiArticle.updated_at,
    word_count: apiArticle.word_count,
    status: apiArticle.status,
    access_type: apiArticle.access_type,
    is_top: apiArticle.is_top,
    is_original: apiArticle.is_original,
  };
};

const FavoritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // 获取收藏文章列表
  const {
    data: favoritesData,
    loading: favoritesLoading,
    refresh: refreshFavorites,
    run: loadFavorites,
  } = useRequest(
    (page: number, size: number) => GetFavoriteArticles(page, size),
    {
      manual: true,
      onError: (error) => {
        console.error('获取收藏列表失败:', error);
        message.error('获取收藏列表失败，请稍后重试');
      },
    },
  );

  // 初始化加载数据
  React.useEffect(() => {
    loadFavorites(currentPage, pageSize);
  }, [currentPage, pageSize, loadFavorites]);

  // 获取所有收藏文章（用于前端筛选和统计）
  const [allArticles, setAllArticles] = useState<ArticleListItem[]>([]);

  // 当需要进行前端筛选时，获取所有数据
  React.useEffect(() => {
    if (searchTerm || filterType !== 'all' || sortType !== 'date') {
      // 如果有筛选条件，获取所有数据进行前端筛选
      const loadAllData = async () => {
        try {
          // 这里可能需要多次请求来获取所有数据
          // 暂时使用当前页的数据
          if (favoritesData?.list) {
            setAllArticles(favoritesData.list.map(convertArticleData));
          }
        } catch (error) {
          console.error('加载全部数据失败:', error);
        }
      };
      loadAllData();
    }
  }, [favoritesData, searchTerm, filterType, sortType]);

  // 转换并过滤文章数据（仅用于前端筛选）
  const filteredArticles = useMemo(() => {
    // 如果没有筛选条件，直接使用当前页数据
    if (!searchTerm && filterType === 'all' && sortType === 'date') {
      return favoritesData?.list?.map(convertArticleData) || [];
    }

    // 有筛选条件时，使用全部数据进行筛选
    let articles = [...allArticles];

    // 搜索过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.summary.toLowerCase().includes(searchLower) ||
          article.author_name.toLowerCase().includes(searchLower) ||
          article.category_name.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) =>
            tag.name.toLowerCase().includes(searchLower),
          ),
      );
    }

    // 分类过滤
    if (filterType !== 'all') {
      // 这里可以根据需要添加更多过滤逻辑
      // 例如按分类、标签等过滤
    }

    // 排序
    articles.sort((a, b) => {
      switch (sortType) {
        case 'date':
          return (
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
          );
        case 'views':
          return b.view_count - a.view_count;
        case 'likes':
          return b.like_count - a.like_count;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return articles;
  }, [favoritesData, allArticles, searchTerm, filterType, sortType]);

  // 当前显示的文章列表
  const displayArticles = useMemo(() => {
    // 如果有筛选条件，显示筛选后的结果（需要重新分页）
    if (searchTerm || filterType !== 'all' || sortType !== 'date') {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredArticles.slice(startIndex, endIndex);
    }

    // 没有筛选条件时，直接显示 API 返回的分页数据
    return favoritesData?.list?.map(convertArticleData) || [];
  }, [
    filteredArticles,
    favoritesData,
    currentPage,
    pageSize,
    searchTerm,
    filterType,
    sortType,
  ]);

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    // 如果清除搜索且没有其他筛选条件，重新加载第一页数据
    if (!value && filterType === 'all' && sortType === 'date') {
      loadFavorites(1, pageSize);
    }
  };

  // 处理过滤
  const handleFilterChange = (value: FilterType) => {
    setFilterType(value);
    setCurrentPage(1);

    // 如果重置为默认筛选且没有其他筛选条件，重新加载第一页数据
    if (value === 'all' && !searchTerm && sortType === 'date') {
      loadFavorites(1, pageSize);
    }
  };

  // 处理排序
  const handleSortChange = (value: SortType) => {
    setSortType(value);
    setCurrentPage(1);

    // 如果重置为默认排序且没有其他筛选条件，重新加载第一页数据
    if (value === 'date' && !searchTerm && filterType === 'all') {
      loadFavorites(1, pageSize);
    }
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 如果没有筛选条件，重新加载数据
    if (!searchTerm && filterType === 'all' && sortType === 'date') {
      loadFavorites(page, pageSize);
    }
  };

  // 处理取消收藏
  const handleUnfavorite = async (id: number) => {
    try {
      const response = await ArticleAction(id, { action: 'unfavorite' });
      if (response.code === 0) {
        message.success('已取消收藏');
        // 重新加载当前页数据
        loadFavorites(currentPage, pageSize);
      } else {
        message.error(response.message || '取消收藏失败');
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
      message.error('取消收藏失败，请稍后重试');
    }
  };

  // 处理点赞
  const handleLike = async (id: number, isLiked: boolean) => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await ArticleAction(id, { action });
      if (response.code === 0) {
        message.success(isLiked ? '已取消点赞' : '点赞成功');
        // 重新加载当前页数据
        loadFavorites(currentPage, pageSize);
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  // 处理文章点击
  const handleArticleClick = (id: number) => {
    history.push(`/article-detail/${id}`);
  };

  // 处理作者点击
  const handleAuthorClick = (authorId: number) => {
    history.push(`/users/${authorId}`);
  };

  // 统计信息
  const stats = useMemo(() => {
    // 如果有筛选条件，使用筛选后的数据统计
    if (searchTerm || filterType !== 'all' || sortType !== 'date') {
      const total = filteredArticles.length;
      const totalViews = filteredArticles.reduce(
        (sum, article) => sum + article.view_count,
        0,
      );
      const totalLikes = filteredArticles.reduce(
        (sum, article) => sum + article.like_count,
        0,
      );

      return {
        total,
        totalViews,
        totalLikes,
        avgViews: total > 0 ? Math.round(totalViews / total) : 0,
        avgLikes: total > 0 ? Math.round(totalLikes / total) : 0,
      };
    }

    // 没有筛选条件时，使用当前页数据进行统计
    // 注意：这里的统计只是当前页的统计，不是全部数据的统计
    const currentPageArticles = displayArticles;
    const total = favoritesData?.total || 0; // 使用 API 返回的总数
    const currentPageViews = currentPageArticles.reduce(
      (sum, article) => sum + article.view_count,
      0,
    );
    const currentPageLikes = currentPageArticles.reduce(
      (sum, article) => sum + article.like_count,
      0,
    );

    return {
      total,
      totalViews: currentPageViews, // 这只是当前页的统计
      totalLikes: currentPageLikes, // 这只是当前页的统计
      avgViews:
        currentPageArticles.length > 0
          ? Math.round(currentPageViews / currentPageArticles.length)
          : 0,
      avgLikes:
        currentPageArticles.length > 0
          ? Math.round(currentPageLikes / currentPageArticles.length)
          : 0,
    };
  }, [
    filteredArticles,
    displayArticles,
    favoritesData,
    searchTerm,
    filterType,
    sortType,
  ]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <motion.div variants={itemVariants}>
          <FavoriteHeader stats={stats} />
        </motion.div>

        {/* 筛选和搜索 */}
        <motion.div variants={itemVariants} className="mt-8">
          <FavoriteFilters
            searchTerm={searchTerm}
            filterType={filterType}
            sortType={sortType}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </motion.div>

        {/* 内容区域 */}
        <motion.div variants={containerVariants} className="mt-8">
          {favoritesLoading ? (
            <motion.div
              variants={simpleFadeIn}
              className="flex justify-center items-center py-20"
            >
              <Spin size="large" tip="加载收藏列表中..." />
            </motion.div>
          ) : displayArticles.length > 0 ? (
            <motion.div variants={itemVariants}>
              <FavoriteList
                articles={displayArticles}
                total={
                  searchTerm || filterType !== 'all' || sortType !== 'date'
                    ? filteredArticles.length
                    : favoritesData?.total || 0
                }
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onArticleClick={handleArticleClick}
                onAuthorClick={handleAuthorClick}
                onUnfavorite={handleUnfavorite}
                onLike={handleLike}
              />
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <EmptyState
                searchTerm={searchTerm}
                onClearSearch={() => handleSearchChange('')}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FavoritesPage;
