import { GetArticleDetail } from '@/api/article';
import type { Article } from '@/api/article/type';
import { GetCommentList } from '@/api/comment';
import type { CommentItem, CommentItem as ApiComment } from '@/api/comment/type';
import { CreateReadingHistory } from '@/api/reading-history';
import { containerVariants, pageVariants } from '@/constants/animations';
import { useUserStore } from '@/stores/userStore';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, message, Result, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  ArticleContent,
  ArticleHeader,
  CommentSection,
  TableOfContents,
} from './components';
const ArticleDetailPage: React.FC = () => {
  const { currentUser, isLoggedIn } = useUserStore();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
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
      },
    },
  );

  useEffect(() => {
    if (commentsResponse?.list) {
      setComments(commentsResponse.list);
    }
  }, [commentsResponse]);

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
      setArticle(articleResponse);

      // 只有在用户登录时才记录阅读历史
      if (isLoggedIn) {
        CreateReadingHistory({ article_id: articleResponse.id })
          .then(() => {
            console.log('阅读历史记录成功');
          })
          .catch((error: any) => {
            console.error('记录阅读历史失败:', error);
            // 不显示错误消息，因为这不是关键功能
          });
      }
    }
  }, [articleResponse, isLoggedIn]);


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
        author={{
          name: article.author_name,
          avatar: article.author_avatar,
        }}
        publishDate={article.published_at}
        views={article.view_count}
        likes={article.like_count}
        comments={article.comment_count}
        tags={article.tags.map((tag) => tag.name)}
        category={article.category_name}
        coverImage={article.cover_image}
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
