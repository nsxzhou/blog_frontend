import React from 'react';
import { motion } from 'framer-motion';
import {
    TagsOutlined,
    PlusCircleOutlined,
    FireOutlined
} from '@ant-design/icons';
import { cardHover, itemVariants } from '@/constants/animations';

interface TagStatsProps {
    stats: {
        total: number;
        recentlyAdded: number;
        popular: number;
    };
}

const TagStats: React.FC<TagStatsProps> = ({ stats }) => {
    const statsData = [
        {
            title: '总标签数',
            value: stats.total,
            icon: <TagsOutlined className="text-blue-600" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: '最近新增',
            value: stats.recentlyAdded,
            icon: <PlusCircleOutlined className="text-green-600" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            extra: '7天内',
        },
        {
            title: '热门标签',
            value: stats.popular,
            icon: <FireOutlined className="text-orange-600" />,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            extra: '活跃',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                </motion.div>
            ))}
        </div>
    );
};

export default TagStats; 