import React from 'react';
import { motion } from 'framer-motion';
import { history } from '@umijs/max';
import {
    CalendarOutlined,
    EyeOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import {
    sectionVariants,
    itemVariants,
    cardHover,
    containerVariants,
    hoverScale,
} from '@/constants/animations';

interface RelatedArticle {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    views: number;
    readTime: number;
    category: string;
    tags: string[];
}

interface RelatedArticlesProps {
    articles: RelatedArticle[];
    currentArticleId: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
    articles,
    currentArticleId,
}) => {
    // 过滤掉当前文章并限制数量
    const filteredArticles = articles
        .filter(article => article.id !== currentArticleId)
        .slice(0, 3);

    if (filteredArticles.length === 0) {
        return null;
    }

    const handleArticleClick = (articleId: number) => {
        history.push(`/article-detail/${articleId}`);
    };

    return (
        <motion.section
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-16 max-w-5xl mx-auto px-4"
        >
            {/* 标题 */}
            <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    相关推荐
                </h2>
                <p className="text-gray-600">
                    您可能感兴趣的其他文章
                </p>
            </motion.div>

            {/* 文章列表 */}
            <motion.div
                variants={containerVariants}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {filteredArticles.map((article, index) => (
                    <motion.article
                        key={article.id}
                        variants={itemVariants}
                        custom={index}
                        className="group cursor-pointer"
                        onClick={() => handleArticleClick(article.id)}
                    >
                        <motion.div
                            variants={cardHover}
                            initial="rest"
                            whileHover="hover"
                            className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 h-full"
                        >
                            {/* 文章图片 */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* 分类标签 */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-md">
                                        {article.category}
                                    </span>
                                </div>

                                {/* 阅读时间 */}
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 text-xs font-medium text-white bg-black/50 rounded-md">
                                        {article.readTime}分钟
                                    </span>
                                </div>
                            </div>

                            {/* 文章内容 */}
                            <div className="p-4">
                                {/* 标题 */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>

                                {/* 摘要 */}
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                    {article.excerpt}
                                </p>

                                {/* 标签 */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* 元信息 */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <CalendarOutlined />
                                            {article.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <EyeOutlined />
                                            {article.views}
                                        </span>
                                    </div>

                                    <motion.div
                                        className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        variants={hoverScale}
                                    >
                                        <span>阅读</span>
                                        <ArrowRightOutlined className="text-xs" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.article>
                ))}
            </motion.div>

            {/* 查看更多按钮 */}
            <motion.div
                variants={itemVariants}
                className="text-center mt-8"
            >
                <motion.button
                    {...hoverScale}
                    onClick={() => history.push('/blog')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md"
                >
                    查看更多文章
                    <ArrowRightOutlined />
                </motion.button>
            </motion.div>
        </motion.section>
    );
};

export default RelatedArticles; 