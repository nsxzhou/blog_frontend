import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@umijs/max';
import {
    EyeOutlined,
    HeartOutlined,
    MessageOutlined,
    EditOutlined,
    DeleteOutlined,
    ShareAltOutlined,
    MoreOutlined,
    CalendarOutlined,
    TagOutlined,
} from '@ant-design/icons';
import type { MyArticle } from '../types';
import {
    articleCardVariants,
    cardHover,
    hoverScaleSmall,
    modalVariants
} from '@/constants';

interface MyArticleCardProps {
    article: MyArticle;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onShare: (id: number) => void;
    onClick: (id: number) => void;
}

const statusConfig = {
    published: { label: '已发布', color: 'bg-green-100 text-green-700' },
    draft: { label: '草稿', color: 'bg-yellow-100 text-yellow-700' },
    private: { label: '私密', color: 'bg-red-100 text-red-700' },
};

export const MyArticleCard: React.FC<MyArticleCardProps> = ({
    article,
    onEdit,
    onDelete,
    onClick,
}) => {
    const [showActions, setShowActions] = useState(false);
    const status = statusConfig[article.status];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'text-green-600 bg-green-50';
            case 'draft':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published':
                return '已发布';
            case 'draft':
                return '草稿';
            default:
                return '未知';
        }
    };

    const handleMenuClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        setShowActions(false);
    };

    // ESC键关闭菜单
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowActions(false);
            }
        };

        if (showActions) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showActions]);

    return (
        <motion.div
            variants={articleCardVariants}
            initial="hidden"
            animate="visible"
            {...cardHover}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer relative flex flex-col h-full"
            onClick={() => {
                if (showActions) {
                    setShowActions(false);
                } else {
                    onClick(article.id);
                }
            }}
        >
            {/* 文章图片 */}
            {article.image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    {article.featured && (
                        <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium rounded-lg">
                                推荐
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* 文章内容 */}
            <div className="p-6 flex-1 flex flex-col">
                {!article.image && (
                    <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                            {status.label}
                        </span>
                        {article.featured && (
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium rounded-lg">
                                推荐
                            </span>
                        )}
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                </p>

                {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                                <TagOutlined className="mr-1 text-xs" />
                                {tag}
                            </span>
                        ))}
                        {article.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{article.tags.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <EyeOutlined />
                            <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <HeartOutlined />
                            <span>{article.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageOutlined />
                            <span>{article.comments}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs">
                            <CalendarOutlined />
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>

                        <div className="relative">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActions(!showActions);
                                }}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                {...hoverScaleSmall}
                            >
                                <MoreOutlined />
                            </motion.button>

                            <AnimatePresence>
                                {showActions && (
                                    <motion.div
                                        {...modalVariants}
                                        className="absolute bottom-12 right-4 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => handleMenuClick(e, () => onEdit(article.id))}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                            <EditOutlined />
                                            <span>编辑</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleMenuClick(e, () => onDelete(article.id))}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <DeleteOutlined />
                                            <span>删除</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};