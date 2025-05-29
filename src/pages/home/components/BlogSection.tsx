import { GetLatestArticles, type ArticleListItem } from '@/api/article';
import { Button } from '@/components/ui';
import { containerVariants, itemVariants } from '@/constants/animations';
import EmptyState from '@/pages/blog/components/EmptyState';
import BlogCard from '@/pages/blog/components/BlogCard';
import type { BlogPost } from '@/pages/blog/components/types';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Empty, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

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

const BlogSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取最新文章数据
   */
  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetLatestArticles({
        page: 1,
        page_size: 6, // 只获取前6篇文章
      });

      console.log('API响应:', response); // 调试日志

      if (response.code === 0 && response.data) {
        // 正确访问list属性
        const articles = response.data.list || [];
        console.log('文章列表:', articles); // 调试日志

        if (articles.length > 0) {
          const transformedPosts = articles.map(transformArticleToPost);
          setBlogPosts(transformedPosts);
        } else {
          setBlogPosts([]);
        }
      } else {
        throw new Error(response.message || '获取文章列表失败');
      }
    } catch (err) {
      console.error('获取最新文章失败:', err);
      setError('获取文章列表失败，请稍后重试');
      message.error('获取文章列表失败，请稍后重试');
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="flex justify-center items-center py-20">
      <Spin size="large" />
    </div>
  );

  /**
   * 渲染空状态
   */
  const renderEmpty = () => (
    <EmptyState />
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">{error}</p>
      <Button onClick={fetchLatestArticles}>重试</Button>
    </div>
  );

  return (
    <motion.section variants={itemVariants} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            最新文章
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            分享技术思考与实践经验
          </p>
        </motion.div>

        {loading && renderLoading()}

        {!loading && error && renderError()}

        {!loading && !error && blogPosts.length === 0 && renderEmpty()}

        {!loading && !error && blogPosts.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {blogPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  onTagClick={() => {}}
                />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-12">
              <Button variant="primary" size="lg">
                <span className="flex items-center gap-2">
                  查看全部文章
                  <ArrowRightOutlined />
                </span>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default BlogSection;
