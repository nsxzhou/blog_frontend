import React from 'react';
import { motion } from 'framer-motion';
import {
    CalendarOutlined,
    EyeOutlined,
    HeartOutlined,
    CommentOutlined,
    TagOutlined,
    ShareAltOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import {
    articleHeaderVariants,
    itemVariants,
    hoverScale,
    fadeInUp,
} from '@/constants/animations';
import { UserAvatar } from '@/components/ui';

interface ArticleHeaderProps {
    title: string;
    author: {
        name: string;
        avatar: string;
        bio?: string;
    };
    publishDate: string;
    views: number;
    likes: number;
    comments: number;
    tags: string[];
    category: string;
    coverImage?: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
    title,
    author,
    publishDate,
    views,
    likes,
    comments,
    tags,
    category,
    coverImage,
}) => {
    return (
        <motion.header
            variants={articleHeaderVariants}
            initial="initial"
            animate="animate"
            className="relative mb-8"
        >
            {/* 封面图片 */}
            {coverImage && (
                <motion.div
                    variants={fadeInUp}
                    className="relative h-64 md:h-80 lg:h-96 mb-8 overflow-hidden"
                >
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>
            )}

            <div className="max-w-5xl mx-auto px-4">
                {/* 分类标签 */}
                <motion.div variants={itemVariants} className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                        <TagOutlined />
                        {category}
                    </span>
                </motion.div>

                {/* 文章标题 */}
                <motion.h1
                    variants={itemVariants}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                >
                    {title}
                </motion.h1>

                {/* 作者信息和统计数据 */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                >
                    {/* 作者信息 */}
                    <div className="flex items-center gap-4">
                        <UserAvatar
                            size="md"
                            alt={author.name}
                            src={author.avatar}
                            user={author}
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">{author.name}</h3>
                            {author.bio && (
                                <p className="text-sm text-gray-600">{author.bio}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <CalendarOutlined />
                                    {publishDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    {/* <div className="flex items-center gap-2">
                        <motion.div {...hoverScale}>
                            <Button
                                type="text"
                                icon={<HeartOutlined />}
                                className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                            >
                                {likes}
                            </Button>
                        </motion.div>
                        <motion.div {...hoverScale}>
                            <Button
                                type="text"
                                icon={<BookOutlined />}
                                className="text-gray-600 hover:text-blue-500"
                            >
                                收藏
                            </Button>
                        </motion.div>
                        <motion.div {...hoverScale}>
                            <Button
                                type="text"
                                icon={<ShareAltOutlined />}
                                className="text-gray-600 hover:text-green-500"
                            >
                                分享
                            </Button>
                        </motion.div>
                    </div> */}
                </motion.div>

                {/* 统计信息 */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-200"
                >
                    <span className="flex items-center gap-1">
                        <EyeOutlined />
                        {views} 次浏览
                    </span>
                    <span className="flex items-center gap-1">
                        <HeartOutlined />
                        {likes} 点赞
                    </span>
                    <span className="flex items-center gap-1">
                        <CommentOutlined />
                        {comments} 评论
                    </span>
                </motion.div>

                {/* 标签 */}
                {tags.length > 0 && (
                    <motion.div variants={itemVariants} className="mt-6">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
};

export default ArticleHeader; 