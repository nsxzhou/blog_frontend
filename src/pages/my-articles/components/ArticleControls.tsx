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
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      {/* 顶部操作栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-800">我的文章</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg font-medium">
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
        <div className="relative">
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章标题或内容..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* 状态过滤器 */}
        <div className="relative group">
          <FilterOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer text-gray-700 font-medium shadow-sm hover:shadow-md"
          >
            {filterOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 排序选择器 */}
        <div className="relative group">
          <SortAscendingOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer text-gray-700 font-medium shadow-sm hover:shadow-md"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                按{option.label}排序
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 状态标签 */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filterOptions.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => onFilterChange(option.key as FilterType)}
            className={`
              px-3 py-1 rounded-lg text-sm font-medium transition-all
              ${filterType === option.key
                ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}; 