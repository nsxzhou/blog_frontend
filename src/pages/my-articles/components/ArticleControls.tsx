import React from 'react';
import { motion } from 'framer-motion';
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { FilterType, SortType } from '../types';

interface ArticleControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  sortType: SortType;
  onSortChange: (type: SortType) => void;
  totalCount: number;
  onCreateNew: () => void;
}

const filterOptions = [
  { key: 'all', label: '全部文章', color: 'text-gray-600' },
  { key: 'published', label: '已发布', color: 'text-green-600' },
  { key: 'draft', label: '草稿', color: 'text-yellow-600' },
  { key: 'private', label: '私密', color: 'text-red-600' },
];

const sortOptions = [
  { key: 'date', label: '发布时间' },
  { key: 'views', label: '阅读量' },
  { key: 'likes', label: '点赞数' },
  { key: 'title', label: '标题' },
];

const controlsVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const ArticleControls: React.FC<ArticleControlsProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortType,
  onSortChange,
  totalCount,
  onCreateNew,
}) => {
  return (
    <motion.div
      variants={controlsVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      {/* 顶部操作栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-800">我的文章</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium border border-blue-100">
            共 {totalCount} 篇
          </span>
        </div>

        <motion.button
          onClick={onCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusOutlined />
          <span>写新文章</span>
        </motion.button>
      </div>

      {/* 搜索和过滤器 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 搜索框 */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="搜索文章标题或内容..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 placeholder-gray-400 text-gray-700"
          />
        </motion.div>

        {/* 状态过滤器 */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <FilterOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 z-10" />
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer text-gray-700 font-medium"
          >
            {filterOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <motion.svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </motion.div>

        {/* 排序选择器 */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <SortAscendingOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 z-10" />
          <select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer text-gray-700 font-medium"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                按{option.label}排序
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <motion.svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </motion.div>
      </div>

      {/* 状态标签 */}
      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
        {filterOptions.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => onFilterChange(option.key as FilterType)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${filterType === option.key
                ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700'
              }
            `}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};