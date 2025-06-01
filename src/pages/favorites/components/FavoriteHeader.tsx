import { fadeInUp, itemVariants } from '@/constants/animations';
import {
  BookmarkIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

interface Stats {
  total: number;
  totalViews: number;
  totalLikes: number;
  avgViews: number;
  avgLikes: number;
}

interface FavoriteHeaderProps {
  stats: Stats;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}> = ({ icon, title, value, description }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -2, scale: 1.02 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-1">
          {icon}
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  </motion.div>
);

const FavoriteHeader: React.FC<FavoriteHeaderProps> = ({ stats }) => {
  return (
    <motion.div variants={fadeInUp} className="space-y-6">
      {/* 页面标题 */}
      <div>
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的收藏</h1>
            <p className="text-gray-600 mt-1">管理您收藏的精彩文章</p>
          </div>
        </motion.div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookmarkIcon className="w-4 h-4" />}
          title="收藏文章"
          value={stats.total}
          description="总收藏数量"
        />
        <StatCard
          icon={<EyeIcon className="w-4 h-4" />}
          title="总阅读量"
          value={stats.totalViews}
          description={`平均 ${stats.avgViews} 次/篇`}
        />
        <StatCard
          icon={<HeartIcon className="w-4 h-4" />}
          title="获赞总数"
          value={stats.totalLikes}
          description={`平均 ${stats.avgLikes} 个/篇`}
        />
        <StatCard
          icon={<ChartBarIcon className="w-4 h-4" />}
          title="互动指数"
          value={Math.round((stats.avgViews + stats.avgLikes * 5) / 2)}
          description="综合活跃度"
        />
      </div>

      {/* 收藏提示 */}
      {stats.total === 0 && (
        <motion.div variants={itemVariants} className="text-center py-8">
          <div className="text-gray-500 text-sm">
            还没有收藏任何文章，快去发现感兴趣的内容吧！
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoriteHeader;
