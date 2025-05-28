import {
  GetHotArticles,
  GetLatestArticles,
  SearchArticles,
  type ArticleListItem,
  type SearchArticleQuery,
} from '@/api/article';
import { GetCategoryList, type CategoryInfo } from '@/api/category';
import { GetTagList, type TagInfo } from '@/api/tag';
import { containerVariants, itemVariants } from '@/constants/animations';
import { message, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BlogFilters,
  BlogHeader,
  BlogList,
  BlogSearch,
  type BlogPost,
} from './components';

/**
 * 将API返回的文章数据转换为BlogPost格式
 */
const transformArticleToPost = (article: ArticleListItem): BlogPost => {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    image: article.cover_image,
    date: article.published_at,
    views: article.view_count,
    likes: article.like_count,
    comments: article.comment_count,
    tags: article.tags.map((tag) => tag.name),
    category: article.category_name,
    author: {
      name: article.author_name,
    },
    featured: article.is_top === 1,
  };
};

const BlogPage: React.FC = () => {
  // 搜索和过滤状态
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 数据状态
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [allTags, setAllTags] = useState<string[]>([]);

  // 加载状态
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  /**
   * 获取分类列表
   */
  const fetchCategories = async () => {
    try {
      const response = await GetCategoryList();
      if (response.code === 0 && response.data) {
        const categoryNames =
          response.data.list?.map((item: CategoryInfo) => item.name) || [];
        setCategories(['全部', ...categoryNames]);
      }
    } catch (err) {
      console.error('获取分类列表失败:', err);
    }
  };

  /**
   * 获取标签列表
   */
  const fetchTags = async () => {
    try {
      const response = await GetTagList();
      if (response.code === 0 && response.data) {
        const tagNames =
          response.data.list?.map((item: TagInfo) => item.name) || [];
        setAllTags(tagNames);
      }
    } catch (err) {
      console.error('获取标签列表失败:', err);
    }
  };

  /**
   * 根据排序类型获取文章
   */
  const fetchArticlesBySortType = useCallback(
    async (resetPage = false) => {
      try {
        const targetPage = resetPage ? 1 : currentPage;
        setSearchLoading(true);
        setError(null);

        let response;

        if (sortBy === 'latest') {
          // 获取最新文章
          response = await GetLatestArticles({
            page: targetPage,
            page_size: pageSize,
          });
        } else if (sortBy === 'hot') {
          // 获取热门文章
          response = await GetHotArticles({
            page: targetPage,
            page_size: pageSize,
          });
        } else {
          // 全部文章 - 使用搜索接口
          const searchParams: SearchArticleQuery = {
            page: targetPage,
            page_size: pageSize,
            keyword: searchTerm || undefined,
            status: 'published',
            access_type: 'public',
          };
          response = await SearchArticles(searchParams);
        }

        if (response.code === 0 && response.data) {
          const articles = response.data.list || [];
          const transformedPosts = articles.map(transformArticleToPost);
          setBlogPosts(transformedPosts);
          setTotal(response.data.total || 0);

          if (resetPage) {
            setCurrentPage(1);
          }
        } else {
          throw new Error(response.message || '获取文章失败');
        }
      } catch (err) {
        console.error('获取文章失败:', err);
        setError('获取文章列表失败，请稍后重试');
        message.error('获取文章列表失败，请稍后重试');
        setBlogPosts([]);
        setTotal(0);
      } finally {
        setSearchLoading(false);
      }
    },
    [currentPage, searchTerm, pageSize, sortBy],
  );

  /**
   * 初始化数据
   */
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // 并行获取分类、标签数据
        await Promise.all([fetchCategories(), fetchTags()]);

        // 获取初始文章数据
        await fetchArticlesBySortType();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []); // 空依赖数组，只在组件挂载时执行

  // 搜索词变化时重新搜索
  useEffect(() => {
    if (loading) return; // 如果正在初始化加载中，不执行搜索

    const timeoutId = setTimeout(() => {
      fetchArticlesBySortType(true);
    }, 500); // 防抖

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchArticlesBySortType]); // 依赖searchTerm和fetchArticlesBySortType

  // 排序类型变化时重新获取数据
  useEffect(() => {
    if (!loading) {
      fetchArticlesBySortType(true);
    }
  }, [sortBy, fetchArticlesBySortType, loading]); // 依赖sortBy

  // 页码变化时搜索
  useEffect(() => {
    if (!loading && currentPage > 1) {
      fetchArticlesBySortType();
    }
  }, [currentPage, loading, fetchArticlesBySortType]); // 依赖currentPage、loading和fetchArticlesBySortType

  // 客户端过滤逻辑（基于已获取的数据进行二次过滤）
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === '全部' || post.category === activeCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));

      return matchesCategory && matchesTags;
    });

    // 注意：这里不再需要排序逻辑，因为已经通过API获取了排序后的数据
    return filtered;
  }, [blogPosts, activeCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filterKey = `${activeCategory}-${searchTerm}-${selectedTags.join(
    ',',
  )}-${sortBy}`;

  /**
   * 渲染加载状态
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* 头部区域 */}
      <BlogHeader blogPosts={filteredPosts} />

      {/* 搜索和过滤区域 */}
      <motion.section variants={itemVariants} className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* 搜索栏 */}
          <BlogSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={searchLoading}
          />

          {/* 过滤器 */}
          <BlogFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </motion.section>

      {/* 文章列表区域 */}
      <motion.section variants={itemVariants} className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <BlogList
            filteredPosts={filteredPosts}
            key={filterKey}
            onTagClick={toggleTag}
            filterKey={filterKey}
            loading={searchLoading}
            error={error}
            onRetry={() => fetchArticlesBySortType(true)}
            pagination={{
              current: currentPage,
              total,
              pageSize,
              onChange: setCurrentPage,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default BlogPage;
