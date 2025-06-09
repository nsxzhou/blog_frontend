import { GetArticleDetail } from '@/api/article';
import type { Article as ApiArticle } from '@/api/article/type';
import { GetCommentList } from '@/api/comment';
import type { CommentItem as ApiComment } from '@/api/comment/type';
import { CreateReadingHistory } from '@/api/reading-history';
import { containerVariants, pageVariants } from '@/constants/animations';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useParams, useRequest, useModel } from '@umijs/max';
import { Button, message, Result, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  ArticleContent,
  ArticleHeader,
  CommentSection,
  TableOfContents,
} from './components';
import type { Article, Comment } from './types';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');
  const [article, setArticle] = useState<Article | null>(null);
  //const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tocVisible, setTocVisible] = useState(false);

  // 获取文章详情
  const {
    data: articleResponse,
    loading: articleLoading,
    error: articleError,
  } = useRequest(
    () => {
      if (!id) return Promise.reject(new Error('文章ID不能为空'));
      return GetArticleDetail(parseInt(id));
    },
    {
      refreshDeps: [id],
      onError: (error) => {
        console.error('获取文章详情失败:', error);
        message.error('获取文章详情失败');
      },
    },
  );

  // 获取评论列表
  const { data: commentsResponse, refresh: refreshComments } = useRequest(
    () => {
      if (!id) return Promise.reject(new Error('文章ID不能为空'));
      return GetCommentList({
        article_id: parseInt(id),
        status: 'approved',
        page: 1,
        page_size: 50,
        order_by: 'created_at',
        order: 'desc',
      });
    },
    {
      refreshDeps: [id],
      onError: (error) => {
        console.error('获取评论列表失败:', error);
        message.error('获取评论列表失败');
      },
    },
  );

  // 获取相关文章
  // const { data: relatedResponse } = useRequest(
  //   async () => {
  //     if (!articleResponse?.category_id) return null;

  //     // 获取同分类的其他文章作为相关文章
  //     const response = await GetArticles({
  //       category_id: articleResponse.category_id,
  //       status: 'published',
  //       access_type: 'public',
  //       page: 1,
  //       page_size: 5,
  //       sort_by: 'view_count',
  //       order: 'desc',
  //     });

  //     return response;
  //   },
  //   {
  //     refreshDeps: [articleResponse?.category_id, id],
  //     ready: !!articleResponse?.category_id,
  //   },
  // );

  // 转换API数据为组件所需格式
  useEffect(() => {
    if (articleResponse) {
      const apiArticle: ApiArticle = articleResponse;

      const convertedArticle: Article = {
        id: apiArticle.id,
        title: apiArticle.title,
        content: apiArticle.content,
        excerpt: apiArticle.summary,
        coverImage: apiArticle.cover_image,
        author: {
          name: apiArticle.author_name,
          avatar: apiArticle.author_avatar,
          bio: '', // API中没有bio字段，使用空字符串
        },
        publishDate: apiArticle.published_at || apiArticle.created_at,
        views: apiArticle.view_count,
        likes: apiArticle.like_count,
        comments: apiArticle.comment_count,
        tags: apiArticle.tags.map((tag) => tag.name),
        category: apiArticle.category_name,
        featured: apiArticle.is_top === 1,
      };

      setArticle(convertedArticle);

      // 只有在用户登录时才记录阅读历史
      if (initialState?.isLoggedIn) {
        CreateReadingHistory({ article_id: apiArticle.id })
          .then(() => {
            console.log('阅读历史记录成功');
          })
          .catch((error: any) => {
            console.error('记录阅读历史失败:', error);
            // 不显示错误消息，因为这不是关键功能
          });
      }
    }
  }, [articleResponse, initialState?.isLoggedIn]);

  // 转换相关文章数据
  // useEffect(() => {
  //   if (relatedResponse?.data?.list) {
  //     // 过滤掉当前文章
  //     const filtered = relatedResponse.data.list.filter(
  //       (item: ArticleListItem) => item.id !== parseInt(id || '0'),
  //     );
  //     const convertedRelated: RelatedArticle[] = filtered
  //       .slice(0, 3)
  //       .map((item: ArticleListItem) => ({
  //         id: item.id,
  //         title: item.title,
  //         excerpt: item.summary,
  //         image: item.cover_image,
  //         date: item.published_at
  //           ? new Date(item.published_at).toISOString().split('T')[0]
  //           : new Date().toISOString().split('T')[0],
  //         views: item.view_count,
  //         readTime: Math.ceil(item.word_count / 200),
  //         category: item.category_name,
  //         tags: item.tags.map((tag) => tag.name),
  //       }));

  //     setRelatedArticles(convertedRelated);
  //   }
  // }, [relatedResponse, id]);

  // 转换评论数据
  useEffect(() => {
    if (commentsResponse?.list) {
      const convertedComments: Comment[] = commentsResponse.list.map(
        (item: ApiComment) => ({
          id: item.id,
          author: {
            name: item.user.nickname || item.user.username,
            avatar: item.user.avatar,
          },
          content: item.content,
          date: new Date(item.created_at).toLocaleString('zh-CN'),
          likes: item.like_count,
          isLiked: item.liked_by_me,
          replies:
            item.children?.map((child) => ({
              id: child.id,
              author: {
                name: child.user.nickname || child.user.username,
                avatar: child.user.avatar,
              },
              content: child.content,
              date: new Date(child.created_at).toLocaleString('zh-CN'),
              likes: child.like_count,
              isLiked: false, // API中children没有liked_by_me字段
            })) || [],
        }),
      );

      setComments(convertedComments);
    }
  }, [commentsResponse]);

  // 返回按钮
  const handleBack = () => {
    history.back();
  };

  // 评论更新回调
  const handleCommentUpdate = () => {
    refreshComments(); // 刷新评论列表
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="404"
          title="文章未找到"
          subTitle={
            typeof articleError === 'string'
              ? articleError
              : articleError?.message || '抱歉，您访问的文章不存在'
          }
          extra={
            <Button type="primary" onClick={handleBack}>
              返回上一页
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    >
      {/* 返回按钮 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            返回
          </Button>
        </div>
      </motion.div>

      {/* 文章头部 */}
      <ArticleHeader
        title={article.title}
        author={article.author}
        publishDate={article.publishDate}
        views={article.views}
        likes={article.likes}
        comments={article.comments}
        tags={article.tags}
        category={article.category}
        coverImage={article.coverImage}
      />

      {/* 文章内容 */}
      <ArticleContent content={article.content} onContentLoaded={() => { }} />

      {/* 相关文章 */}
      {/* <RelatedArticles
        articles={relatedArticles}
        currentArticleId={article.id}
      /> */}

      {/* 评论区 */}
      <CommentSection
        comments={comments}
        articleId={article.id}
        onCommentUpdate={handleCommentUpdate}
      />

      {/* 目录导航 */}
      <TableOfContents
        isVisible={tocVisible}
        onToggle={() => setTocVisible(!tocVisible)}
        articleId={article.id}
        initialLiked={articleResponse?.is_liked || false}
        initialFavorited={articleResponse?.is_favorited || false}
      />
    </motion.div>
  );
};

export default ArticleDetailPage;
