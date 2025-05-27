import React from 'react';
import { motion } from 'framer-motion';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/constants/animations';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    visibilityFilter: 'all' | 'visible' | 'hidden';
    onVisibilityFilterChange: (value: 'all' | 'visible' | 'hidden') => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
    visibilityFilter,
    onVisibilityFilterChange,
}) => {
    return (
        <motion.div {...fadeInUp} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* 搜索框 */}
                <div className="flex-1">
                    <Input
                        size="large"
                        placeholder="搜索分类名称或描述..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        allowClear
                        className="rounded-lg"
                    />
                </div>

                {/* 可见性筛选 */}
                <div className="sm:w-48">
                    <Select
                        size="large"
                        value={visibilityFilter}
                        onChange={onVisibilityFilterChange}
                        className="w-full"
                        placeholder="筛选可见性"
                        suffixIcon={<FilterOutlined className="text-gray-400" />}
                        options={[
                            { value: 'all', label: '全部分类' },
                            { value: 'visible', label: '可见分类' },
                            { value: 'hidden', label: '隐藏分类' },
                        ]}
                    />
                </div>
            </div>

            {/* 搜索结果提示 */}
            {searchTerm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-100"
                >
                    <p className="text-sm text-gray-600">
                        搜索 "<span className="font-medium text-blue-600">{searchTerm}</span>" 的结果
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SearchAndFilter;