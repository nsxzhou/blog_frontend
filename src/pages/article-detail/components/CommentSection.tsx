import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageOutlined,
    LikeOutlined,
    LikeFilled,
    ArrowUpOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Avatar, message } from 'antd';
import {
    sectionVariants,
    itemVariants,
    containerVariants,
    hoverScale,
    fadeInUp,
} from '@/constants/animations';

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
}

const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    articleId,
}) => {
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    // 提交评论
    const handleSubmitComment = async () => {
        if (!commentText.trim()) {
            message.warning('请输入评论内容');
            return;
        }

        setLoading(true);
        try {
            // 这里应该调用API提交评论
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('评论提交成功');
            setCommentText('');
        } catch (error) {
            message.error('评论提交失败');
        } finally {
            setLoading(false);
        }
    };

    // 提交回复
    const handleSubmitReply = async (commentId: number) => {
        if (!replyText.trim()) {
            message.warning('请输入回复内容');
            return;
        }

        setLoading(true);
        try {
            // 这里应该调用API提交回复
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('回复提交成功');
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            message.error('回复提交失败');
        } finally {
            setLoading(false);
        }
    };

    // 点赞评论
    const handleLikeComment = (commentId: number) => {
        // 这里应该调用API点赞评论
        message.info('点赞功能开发中');
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
                                className={`flex items-center gap-1 text-xs transition-colors ${comment.isLiked
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
                                        loading={loading}
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
                                {comment.replies.map(reply => renderComment(reply, true))}
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
            className="mt-20 max-w-5xl mx-auto px-4"
        >
            {/* 标题 */}
            <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    评论 ({comments.length})
                </h2>
                <p className="text-gray-600 text-sm">
                    参与讨论，分享你的观点
                </p>
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
                        loading={loading}
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
                            {comments.map(comment => renderComment(comment))}
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
                <motion.div
                    variants={itemVariants}
                    className="text-center mt-6"
                >
                    <button className="text-sm text-blue-600 hover:text-blue-800 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                        查看更多评论
                    </button>
                </motion.div>
            )}
        </motion.section>
    );
};

export default CommentSection; 