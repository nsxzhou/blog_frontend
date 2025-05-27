import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyArticleCard } from './MyArticleCard';
import { EmptyState } from './EmptyState';
import { containerVariants, itemVariants } from '@/constants/animations';
import type { MyArticle } from '../types';

interface ArticleListProps {
    articles: MyArticle[];
    loading?: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onShare: (id: number) => void;
    onArticleClick: (id: number) => void;
}

// 骨架屏组件
const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-6">
            <div className="flex items-center justify-between mb-3">
                <div className="w-16 h-5 bg-gray-200 rounded" />
                <div className="w-12 h-5 bg-gray-200 rounded" />
            </div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
            <div className="w-full h-4 bg-gray-200 rounded mb-1" />
            <div className="w-2/3 h-4 bg-gray-200 rounded mb-4" />
            <div className="flex gap-2 mb-4">
                <div className="w-16 h-6 bg-gray-200 rounded" />
                <div className="w-20 h-6 bg-gray-200 rounded" />
                <div className="w-14 h-6 bg-gray-200 rounded" />
            </div>
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                        <div className="w-10 h-4 bg-gray-200 rounded" />
                        <div className="w-10 h-4 bg-gray-200 rounded" />
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    </div>
);

export const ArticleList: React.FC<ArticleListProps> = ({
    articles,
    loading = false,
    onEdit,
    onDelete,
    onShare,
    onArticleClick,
}) => {
    // 加载状态
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    // 空状态
    if (articles.length === 0) {
        return <EmptyState onCreateClick={() => window.location.href = '/write'} />;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {articles.map((article) => (
                    <motion.div
                        key={article.id}
                        variants={itemVariants}
                        layout
                        exit="exit"
                    >
                        <MyArticleCard
                            article={article}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onShare={onShare}
                            onClick={onArticleClick}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}; 