import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { message, Spin, Empty } from 'antd';
import { history } from '@umijs/max';
import {
    StatsCards,
    ArticleControls,
    ArticleList,
    type MyArticle,
    type ArticleStats,
    type FilterType,
    type SortType,
} from './components';
import { EmptyState } from './components/EmptyState';
import { containerVariants, itemVariants } from '@/constants';

// 模拟数据
const mockArticles: MyArticle[] = [
    {
        id: 1,
        title: 'React 18 并发特性深度解析',
        excerpt: '深入探讨React 18中的并发渲染机制，包括Suspense、useDeferredValue和useTransition等新特性的实际应用场景。',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
        date: '2024-01-15',
        lastModified: '2024-01-16',
        readTime: '8 分钟',
        views: 1234,
        likes: 89,
        comments: 23,
        tags: ['React', 'JavaScript', '前端'],
        category: '前端开发',
        status: 'published',
        featured: true,
    },
    {
        id: 2,
        title: 'TypeScript 高级类型技巧总结',
        excerpt: '总结TypeScript中的高级类型技巧，包括条件类型、映射类型、模板字面量类型等实用技术。',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        date: '2024-01-12',
        lastModified: '2024-01-12',
        readTime: '12 分钟',
        views: 856,
        likes: 67,
        comments: 15,
        tags: ['TypeScript', '前端', '类型系统'],
        category: '编程语言',
        status: 'published',
    },
    {
        id: 3,
        title: '微前端架构设计与实践',
        excerpt: '分享微前端架构的设计思路和具体实现方案，以及在大型项目中的应用经验。',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
        date: '2024-01-10',
        lastModified: '2024-01-11',
        readTime: '15 分钟',
        views: 445,
        likes: 34,
        comments: 8,
        tags: ['微前端', '架构', '工程化'],
        category: '系统架构',
        status: 'draft',
    },
    {
        id: 4,
        title: 'Node.js 性能优化实战',
        excerpt: '从内存管理、异步编程、缓存策略等多个维度分析Node.js应用的性能优化方法。',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop',
        date: '2024-01-08',
        lastModified: '2024-01-08',
        readTime: '10 分钟',
        views: 623,
        likes: 45,
        comments: 12,
        tags: ['Node.js', '性能优化', '后端'],
        category: '后端开发',
        status: 'published',
    },
    {
        id: 5,
        title: 'CSS Grid 布局完全指南',
        excerpt: '全面介绍CSS Grid布局的各种特性和使用技巧，帮助开发者掌握现代CSS布局技术。',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
        date: '2024-01-05',
        lastModified: '2024-01-05',
        readTime: '6 分钟',
        views: 234,
        likes: 18,
        comments: 5,
        tags: ['CSS', '布局', '前端'],
        category: '前端开发',
        status: 'private',
    },
    {
        id: 6,
        title: 'Vue 3 Composition API 最佳实践',
        excerpt: '分享Vue 3 Composition API的使用心得和最佳实践，提升开发效率和代码质量。',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
        date: '2024-01-03',
        lastModified: '2024-01-03',
        readTime: '9 分钟',
        views: 567,
        likes: 42,
        comments: 11,
        tags: ['Vue', 'Composition API', '前端'],
        category: '前端开发',
        status: 'published',
        featured: true,
    },
];

const MyArticlesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [sortType, setSortType] = useState<SortType>('date');
    const [loading, setLoading] = useState(false);

    // 计算统计数据
    const stats: ArticleStats = useMemo(() => {
        const publishedArticles = mockArticles.filter(article => article.status === 'published');
        const draftArticles = mockArticles.filter(article => article.status === 'draft');

        return {
            totalArticles: mockArticles.length,
            totalViews: mockArticles.reduce((sum, article) => sum + article.views, 0),
            totalLikes: mockArticles.reduce((sum, article) => sum + article.likes, 0),
            totalComments: mockArticles.reduce((sum, article) => sum + article.comments, 0),
            publishedCount: publishedArticles.length,
            draftCount: draftArticles.length,
        };
    }, []);

    // 过滤和排序文章
    const filteredArticles = useMemo(() => {
        let filtered = mockArticles.filter(article => {
            // 搜索过滤
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

            // 状态过滤
            const matchesFilter = filterType === 'all' || article.status === filterType;

            return matchesSearch && matchesFilter;
        });

        // 排序
        switch (sortType) {
            case 'date':
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case 'views':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'likes':
                filtered.sort((a, b) => b.likes - a.likes);
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return filtered;
    }, [searchTerm, filterType, sortType]);

    // 处理操作
    const handleCreateNew = () => {
        history.push('/write');
    };

    const handleEdit = (id: number) => {
        history.push(`/write?id=${id}`);
    };

    const handleDelete = (id: number) => {
        message.success('文章删除成功');
        // 这里应该调用API删除文章
    };

    const handleShare = (id: number) => {
        navigator.clipboard.writeText(`${window.location.origin}/article-detail/${id}`);
        message.success('链接已复制到剪贴板');
    };

    const handleArticleClick = (id: number) => {
        history.push(`/article-detail/${id}`);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gray-50 py-8"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 页面标题 */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">我的文章</h1>
                </motion.div>

                {/* 统计卡片 */}
                <motion.div variants={itemVariants}>
                    <StatsCards stats={stats} />
                </motion.div>

                {/* 控制栏 */}
                <motion.div variants={itemVariants}>
                    <ArticleControls
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterType={filterType}
                        onFilterChange={setFilterType}
                        sortType={sortType}
                        onSortChange={setSortType}
                        totalCount={filteredArticles.length}
                        onCreateNew={handleCreateNew}
                    />
                </motion.div>

                {/* 文章列表 */}
                <motion.div variants={itemVariants}>
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        searchTerm || filterType !== 'all' ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="没有找到符合条件的文章"
                                className="py-20"
                            />
                        ) : (
                            <EmptyState onCreateClick={handleCreateNew} />
                        )
                    ) : (
                        <ArticleList
                            articles={filteredArticles}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onShare={handleShare}
                            onArticleClick={handleArticleClick}
                        />
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default MyArticlesPage;
