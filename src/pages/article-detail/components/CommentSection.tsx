import { CreateComment, LikeComment, ReplyComment } from '@/api/comment';
import {
  containerVariants,
  fadeInUp,
  hoverScale,
  itemVariants,
  sectionVariants,
} from '@/constants/animations';
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Avatar, Button, Input, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const { TextArea } = Input;

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  articleId: number;
  onCommentUpdate?: () => void; // 评论更新回调，用于刷新评论列表
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  articleId,
  onCommentUpdate,
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // 创建评论
  const { run: createComment, loading: createCommentLoading } = useRequest(
    (content: string) =>
      CreateComment({
        article_id: articleId,
        content,
      }),
    {
      manual: true,
      onSuccess: () => {
        message.success('评论发表成功');
        setCommentText('');
        onCommentUpdate?.(); // 刷新评论列表
      },
      onError: (error) => {
        console.error('发表评论失败:', error);
        message.error('评论发表失败，请稍后重试');
      },
    },
  );

  // 回复评论
  const { run: replyComment, loading: replyCommentLoading } = useRequest(
    (commentId: number, content: string) =>
      ReplyComment({
        comment_id: commentId,
        content,
      }),
    {
      manual: true,
      onSuccess: () => {
        message.success('回复发表成功');
        setReplyText('');
        setReplyingTo(null);
        onCommentUpdate?.(); // 刷新评论列表
      },
      onError: (error) => {
        console.error('回复评论失败:', error);
        message.error('回复发表失败，请稍后重试');
      },
    },
  );

  // 点赞评论
  const { run: likeComment } = useRequest(
    (commentId: number) => LikeComment({ comment_id: commentId }),
    {
      manual: true,
      onSuccess: () => {
        onCommentUpdate?.(); // 刷新评论列表以更新点赞状态
      },
      onError: (error) => {
        console.error('点赞失败:', error);
        message.error('操作失败，请稍后重试');
      },
    },
  );

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('请先登录后再发表评论');
      return;
    }

    createComment(commentText.trim());
  };

  // 提交回复
  const handleSubmitReply = async (commentId: number) => {
    if (!replyText.trim()) {
      message.warning('请输入回复内容');
      return;
    }

    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('请先登录后再发表回复');
      return;
    }

    replyComment(commentId, replyText.trim());
  };

  // 点赞评论
  const handleLikeComment = (commentId: number) => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('请先登录后再点赞');
      return;
    }

    likeComment(commentId);
  };

  // 渲染单条评论
  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      variants={itemVariants}
      className={`${isReply ? 'ml-16 mt-3' : 'mb-6'}`}
    >
      <div className={`${!isReply ? 'border-b border-gray-100 pb-6' : 'pt-3'}`}>
        <div className="flex gap-3">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <Avatar
              src={comment.author.avatar}
              icon={<UserOutlined />}
              size={40}
              className="bg-gray-100"
            />
          </div>

          {/* 评论内容 */}
          <div className="flex-1 min-w-0">
            {/* 用户信息 */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-medium text-gray-900 text-sm">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">{comment.date}</span>
            </div>

            {/* 评论文本 */}
            <div className="text-gray-700 mb-3 text-sm leading-relaxed">
              <p className="whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-4">
              <motion.button
                {...hoverScale}
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  comment.isLiked
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                <span>{comment.likes}</span>
              </motion.button>

              {!isReply && (
                <motion.button
                  {...hoverScale}
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                >
                  回复
                </motion.button>
              )}
            </div>

            {/* 回复表单 */}
            {replyingTo === comment.id && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="mt-4"
              >
                <TextArea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="写下你的回复..."
                  rows={3}
                  className="mb-3 text-sm"
                  style={{ resize: 'none' }}
                />
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="small"
                    loading={replyCommentLoading}
                    onClick={() => handleSubmitReply(comment.id)}
                    className="text-xs"
                  >
                    回复
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="text-xs"
                  >
                    取消
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 回复列表 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      id="comment-section"
      variants={sectionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="my-20 max-w-5xl mx-auto px-4"
    >
      {/* 标题 */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          评论 ({comments.length})
        </h2>
        <p className="text-gray-600 text-sm">参与讨论，分享你的观点</p>
      </motion.div>

      {/* 评论表单 */}
      <motion.div
        variants={itemVariants}
        className="mb-8 bg-white border border-gray-200 rounded-lg p-4"
      >
        <TextArea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="写下你的评论..."
          rows={4}
          className="mb-4 border-gray-200 text-sm"
          style={{ resize: 'none' }}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {commentText.length > 0 && `${commentText.length} 字符`}
          </span>
          <Button
            type="primary"
            loading={createCommentLoading}
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="text-sm"
          >
            发表评论
          </Button>
        </div>
      </motion.div>

      {/* 评论列表 */}
      <motion.div variants={containerVariants}>
        {comments.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="p-4">
              {comments.map((comment) => renderComment(comment))}
            </div>
          </div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white border border-gray-200 rounded-lg"
          >
            <MessageOutlined className="text-2xl text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              还没有评论，来发表第一条评论吧
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 加载更多按钮 */}
      {comments.length > 0 && (
        <motion.div variants={itemVariants} className="text-center mt-6">
          <div className="text-sm text-gray-500">
            {comments.length >= 50 ? (
              <p>显示最新 {comments.length} 条评论</p>
            ) : (
              <p>共 {comments.length} 条评论</p>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default CommentSection;
