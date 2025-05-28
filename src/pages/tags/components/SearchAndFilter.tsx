import React from 'react';
import { motion } from 'framer-motion';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/constants/animations';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
}) => {
    return (
        <motion.div {...fadeInUp} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* 搜索框 */}
                <div className="flex-1">
                    <Input
                        size="large"
                        placeholder="搜索标签名称..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        allowClear
                        className="rounded-lg"
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