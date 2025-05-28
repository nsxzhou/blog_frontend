import React from 'react';
import { motion } from 'framer-motion';
import { Spin, Tooltip } from 'antd';
import {
    FileTextOutlined,
    EyeOutlined,
    HeartOutlined,
    MessageOutlined,
    StarOutlined,
    EditOutlined,
    BookOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { type ArticleStatsRes } from '@/api/article';
import {
    containerVariants,
    itemVariants,
    cardHover,
    fadeInUp
} from '@/constants/animations';
import { type StatsCardData } from '../types';

interface ArticleStatsProps {
    statistics: ArticleStatsRes | null;
    loading: boolean;
}

const ArticleStats: React.FC<ArticleStatsProps> = ({ statistics, loading }) => {
    // 统计卡片数据
    const statsCards: StatsCardData[] = [
        {
            title: '总文章数',
            value: statistics?.total_articles || 0,
            icon: <FileTextOutlined className="text-xl" />,
            color: 'text-blue-600',
        },
        {
            title: '已发布',
            value: statistics?.published_articles || 0,
            icon: <BookOutlined className="text-xl" />,
            color: 'text-green-600',
        },
        {
            title: '草稿箱',
            value: statistics?.draft_articles || 0,
            icon: <EditOutlined className="text-xl" />,
            color: 'text-orange-600',
        },
        {
            title: '总浏览量',
            value: formatNumber(statistics?.total_views || 0),
            icon: <EyeOutlined className="text-xl" />,
            color: 'text-purple-600',
        },
        {
            title: '总点赞数',
            value: formatNumber(statistics?.total_likes || 0),
            icon: <HeartOutlined className="text-xl" />,
            color: 'text-red-600',
        },
        {
            title: '总评论数',
            value: formatNumber(statistics?.total_comments || 0),
            icon: <MessageOutlined className="text-xl" />,
            color: 'text-indigo-600',
        },
        {
            title: '总收藏数',
            value: formatNumber(statistics?.total_favorites || 0),
            icon: <StarOutlined className="text-xl" />,
            color: 'text-yellow-600',
        },
        {
            title: '总字数',
            value: formatWordCount(statistics?.total_word_count || 0),
            icon: <TrophyOutlined className="text-xl" />,
            color: 'text-cyan-600',
        },
    ];

    // 格式化数字
    function formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 格式化字数
    function formatWordCount(count: number): string {
        if (count >= 10000) {
            return (count / 10000).toFixed(1) + '万字';
        }
        return count.toLocaleString() + '字';
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {statsCards.map((card, index) => (
                <motion.div
                    key={card.title}
                    variants={fadeInUp}
                    {...cardHover}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                {card.title}
                            </p>
                            <p className={`text-2xl font-bold ${card.color}`}>
                                {card.value}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full bg-gray-50 ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>

                    {card.trend && (
                        <div className="mt-4 flex items-center">
                            <span className={`text-xs font-medium ${card.trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {card.trend.type === 'up' ? '+' : '-'}{card.trend.value}%
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                                vs 上个月
                            </span>
                        </div>
                    )}
                </motion.div>
            ))}

            {/* 热门文章排行 */}
            {statistics?.top_viewed_articles && statistics.top_viewed_articles.length > 0 && (
                <motion.div
                    variants={fadeInUp}
                    {...cardHover}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2 lg:col-span-2 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            热门文章排行
                        </h3>
                        <EyeOutlined className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {statistics.top_viewed_articles.slice(0, 5).map((article, index) => (
                            <div key={article.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${index === 1 ? 'bg-gray-100 text-gray-800' : ''}
                    ${index === 2 ? 'bg-orange-100 text-orange-800' : ''}
                    ${index > 2 ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                                        {index + 1}
                                    </span>
                                    <Tooltip title={article.title}>
                                        <span className="text-sm text-gray-700 truncate max-w-xs">
                                            {article.title}
                                        </span>
                                    </Tooltip>
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {formatNumber(article.count)} 次浏览
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* 最受欢迎文章 */}
            {statistics?.top_liked_articles && statistics.top_liked_articles.length > 0 && (
                <motion.div
                    variants={fadeInUp}
                    {...cardHover}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2 lg:col-span-2 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            最受欢迎文章
                        </h3>
                        <HeartOutlined className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {statistics.top_liked_articles.slice(0, 5).map((article, index) => (
                            <div key={article.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-red-100 text-red-800' : ''}
                    ${index === 1 ? 'bg-pink-100 text-pink-800' : ''}
                    ${index === 2 ? 'bg-purple-100 text-purple-800' : ''}
                    ${index > 2 ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                                        {index + 1}
                                    </span>
                                    <Tooltip title={article.title}>
                                        <span className="text-sm text-gray-700 truncate max-w-xs">
                                            {article.title}
                                        </span>
                                    </Tooltip>
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {formatNumber(article.count)} 个赞
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ArticleStats; 