import React from 'react';
import { motion } from 'framer-motion';
import {
    FolderOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { cardHover, itemVariants } from '@/constants/animations';

interface CategoryStatsProps {
    stats: {
        total: number;
        visible: number;
        hidden: number;
        recentlyAdded: number;
    };
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
    const statsData = [
        {
            title: '总分类数',
            value: stats.total,
            icon: <FolderOutlined className="text-blue-600" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: '可见分类',
            value: stats.visible,
            icon: <EyeOutlined className="text-green-600" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: '隐藏分类',
            value: stats.hidden,
            icon: <EyeInvisibleOutlined className="text-gray-600" />,
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-600',
        },
        {
            title: '最近新增',
            value: stats.recentlyAdded,
            icon: <PlusCircleOutlined className="text-purple-600" />,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            extra: '7天内',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    variants={itemVariants}
                    custom={index}
                    {...cardHover}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                {stat.extra && (
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                        {stat.extra}
                                    </span>
                                )}
                            </div>
                            <p className={`text-3xl font-bold ${stat.textColor}`}>
                                {stat.value}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center text-xl`}>
                            {stat.icon}
                        </div>
                    </div>

                    {/* 进度条 */}
                    {stat.title === '可见分类' && stats.total > 0 && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-green-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.visible / stats.total) * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {Math.round((stats.visible / stats.total) * 100)}% 可见
                            </p>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default CategoryStats; 