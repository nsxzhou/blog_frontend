import {
  GetArticles,
  type ArticleListItem,
  type UnifiedArticleQuery,
} from '@/api/article';
import { GetCategoryList, type CategoryInfo } from '@/api/category';
import { GetTagList, type TagInfo } from '@/api/tag';
import { containerVariants, itemVariants } from '@/constants/animations';
import { useSearchParams } from '@umijs/max';
import { Spin } from 'antd';
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
  const [searchParams] = useSearchParams();

  // 搜索和过滤状态
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 数据状态
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [allTags, setAllTags] = useState<TagInfo[]>([]);

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
      const response = await GetCategoryList({ is_visible: 1 });
      if (response.code === 0 && response.data) {
        setCategories(response.data.list || []);
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
        setAllTags(response.data.list || []);
      }
    } catch (err) {
      console.error('获取标签列表失败:', err);
    }
  };

  /**
   * 构建查询参数
   */
  const buildQueryParams = useCallback(
    (page: number = currentPage): UnifiedArticleQuery => {
      const params: UnifiedArticleQuery = {
        page,
        page_size: pageSize,
        status: 'published',
        access_type: 'public',
      };

      // 搜索关键词
      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      // 分类过滤
      if (activeCategory !== '全部') {
        const selectedCategoryId = categories.find(
          (cat) => cat.name === activeCategory,
        )?.id;
        if (selectedCategoryId) {
          params.category_id = selectedCategoryId;
        }
      }

      // 标签过滤 - 只支持单个标签（API限制）
      if (selectedTags.length > 0) {
        const selectedTagId = allTags.find(
          (tag) => tag.name === selectedTags[0],
        )?.id;
        if (selectedTagId) {
          params.tag_id = selectedTagId;
        }
      }

      // 排序设置
      switch (sortBy) {
        case 'latest':
          params.sort_by = 'published_at';
          params.order = 'desc';
          break;
        case 'hot':
          params.sort_by = 'view_count';
          params.order = 'desc';
          break;
        default:
          // 默认按发布时间倒序
          params.sort_by = 'published_at';
          params.order = 'desc';
          break;
      }

      return params;
    },
    [
      currentPage,
      pageSize,
      searchTerm,
      activeCategory,
      selectedTags,
      sortBy,
      categories,
      allTags,
    ],
  );

  /**
   * 获取文章列表
   */
  const fetchArticles = useCallback(
    async (resetPage = false) => {
      try {
        const targetPage = resetPage ? 1 : currentPage;
        setSearchLoading(true);
        setError(null);

        const params = buildQueryParams(targetPage);
        const response = await GetArticles(params);

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
        setBlogPosts([]);
        setTotal(0);
      } finally {
        setSearchLoading(false);
      }
    },
    [currentPage, buildQueryParams],
  );

  /**
   * 处理 URL 参数
   */
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(decodeURIComponent(categoryParam));
    }
  }, [searchParams]);

  /**
   * 初始化数据
   */
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // 并行获取分类、标签数据
        await Promise.all([fetchCategories(), fetchTags()]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // 当分类和标签数据加载完成后，获取文章列表
  useEffect(() => {
    if (!loading && categories.length >= 0 && allTags.length >= 0) {
      fetchArticles(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, categories.length, allTags.length]);

  // 搜索词变化时重新搜索
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      fetchArticles(true);
    }, 500); // 防抖

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // 排序类型、分类、标签变化时重新获取数据
  useEffect(() => {
    if (!loading) {
      fetchArticles(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, activeCategory, selectedTags]);

  // 页码变化时搜索 - 修复翻页逻辑
  useEffect(() => {
    if (!loading) {
      fetchArticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // 处理标签选择（因为API只支持单个标签，这里限制只能选择一个）
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return []; // 取消选择
      } else {
        return [tag]; // 只选择一个标签
      }
    });
  };

  // 生成分类列表（包含"全部"选项）
  const categoryOptions = useMemo(() => {
    const categoryNames = categories.map((cat) => cat.name);
    return ['全部', ...categoryNames];
  }, [categories]);

  // 生成标签列表
  const tagOptions = useMemo(() => {
    return allTags.map((tag) => tag.name);
  }, [allTags]);

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
      <BlogHeader />

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
            categories={categoryOptions}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            allTags={tagOptions}
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
            filteredPosts={blogPosts}
            key={filterKey}
            filterKey={filterKey}
            loading={searchLoading}
            error={error}
            onRetry={() => fetchArticles(true)}
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
