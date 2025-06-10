import { GetAllArticleStats, type ArticleStatsRes } from '@/api/article';
import {
  floatingAnimation,
  itemVariants,
  scaleIn,
} from '@/constants/animations';
import { BookOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface BlogHeaderProps {
  // 移除不再需要的blogPosts参数
}

const BlogHeader: React.FC<BlogHeaderProps> = () => {
  const [stats, setStats] = useState<ArticleStatsRes | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 获取全站文章统计数据
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await GetAllArticleStats();
        if (response.code === 0 && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.section variants={itemVariants} className="relative pt-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div {...scaleIn} className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            技术博客
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            分享技术洞察 · 记录成长足迹 · 探索无限可能
          </p>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-8 text-sm text-gray-500 mb-12"
        >
          {loading ? (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <BookOutlined className="text-blue-500" />
                <span>加载中...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <BookOutlined className="text-blue-500" />
                <span>{stats?.published_articles || 0} 篇文章</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOutlined className="text-green-500" />
                <span>{stats?.total_views || 0} 次阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartOutlined className="text-red-500" />
                <span>{stats?.total_likes || 0} 个赞</span>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/6 w-40 h-40 bg-blue-100 rounded-full opacity-20"
          {...floatingAnimation}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/6 w-32 h-32 bg-purple-100 rounded-full opacity-15"
          {...floatingAnimation}
          style={{ animationDelay: '2s' }}
        />
      </div>
    </motion.section>
  );
};

export default BlogHeader;
