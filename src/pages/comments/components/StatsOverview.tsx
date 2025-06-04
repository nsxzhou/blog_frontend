import type { ArticleListItem } from '@/api/article';
import { itemVariants } from '@/constants/animations';
import { Card, Skeleton, Statistic } from 'antd';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  ThumbsUp,
  XCircle,
} from 'lucide-react';
import React from 'react';
import type { ViewMode } from '../types';

interface StatsOverviewProps {
  viewMode: ViewMode;
  selectedArticle: ArticleListItem | null;
  articleStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };
  commentStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };
  articleCount: number;
  loading: boolean;
}

/**
 * 统计信息概览组件
 * 根据不同的视图模式显示相应的统计信息
 */
const StatsOverview: React.FC<StatsOverviewProps> = ({
  viewMode,
  selectedArticle,
  articleStats,
  commentStats,
  articleCount,
  loading,
}) => {
  if (loading) {
    return (
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="shadow-sm">
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      </motion.div>
    );
  }

  const statsConfig = [
    {
      title: '总数',
      value:
        viewMode === 'articles'
          ? articleCount
          : viewMode === 'comments' && selectedArticle
          ? commentStats.total
          : articleStats.total,
      icon: viewMode === 'articles' ? FileText : MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '已通过',
      value:
        viewMode === 'comments' && selectedArticle
          ? commentStats.approved
          : articleStats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '待审核',
      value:
        viewMode === 'comments' && selectedArticle
          ? commentStats.pending
          : articleStats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: '已拒绝',
      value:
        viewMode === 'comments' && selectedArticle
          ? commentStats.rejected
          : articleStats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: '总点赞',
      value:
        viewMode === 'comments' && selectedArticle
          ? commentStats.likes
          : articleStats.likes,
      icon: ThumbsUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <Card className="shadow-sm">
        {/* 标题 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {viewMode === 'articles'
              ? '文章评论统计'
              : selectedArticle
              ? `《${selectedArticle.title}》评论统计`
              : '全局评论统计'}
          </h3>
          {selectedArticle && (
            <p className="text-sm text-gray-500 mt-1">
              作者：{selectedArticle.author_name} • 发布时间：
              {selectedArticle.published_at}
            </p>
          )}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-lg p-4 border border-gray-100`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: stat.color.replace('text-', '#'),
                      }}
                    />
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsOverview;