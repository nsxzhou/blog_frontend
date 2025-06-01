import {
  fadeInUp,
  itemVariants,
  hoverScale,
} from '@/constants/animations';
import { motion } from 'framer-motion';
import React from 'react';
import { Input, Select } from 'antd';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

const { Search } = Input;
const { Option } = Select;

export type FilterType = 'all' | 'recent' | 'popular' | 'category';
export type SortType = 'date' | 'views' | 'likes' | 'title';

interface FavoriteFiltersProps {
  searchTerm: string;
  filterType: FilterType;
  sortType: SortType;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterType) => void;
  onSortChange: (value: SortType) => void;
}

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <motion.button
    variants={hoverScale}
    whileHover="whileHover"
    whileTap="whileTap"
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-blue-500 text-white shadow-md'
        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    {children}
  </motion.button>
);

const FavoriteFilters: React.FC<FavoriteFiltersProps> = ({
  searchTerm,
  filterType,
  sortType,
  onSearchChange,
  onFilterChange,
  onSortChange,
}) => {
  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部收藏' },
    { value: 'recent', label: '最近收藏' },
    { value: 'popular', label: '热门文章' },
    { value: 'category', label: '分类筛选' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'date', label: '收藏时间' },
    { value: 'views', label: '阅读量' },
    { value: 'likes', label: '点赞数' },
    { value: 'title', label: '标题排序' },
  ];

  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 搜索框 */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="relative">
            <Search
              placeholder="搜索收藏的文章..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              onSearch={(value: string) => onSearchChange(value)}
              size="large"
              className="w-full"
              prefix={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              allowClear
            />
          </div>
        </motion.div>

        {/* 筛选选项 */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">筛选：</span>
          </div>
          {filterOptions.map((option) => (
            <FilterButton
              key={option.value}
              active={filterType === option.value}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </motion.div>

        {/* 排序选项 */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">排序：</span>
          </div>
          <Select
            value={sortType}
            onChange={onSortChange}
            size="large"
            className="min-w-[120px]"
          >
            {sortOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </motion.div>
      </div>

      {/* 快捷筛选提示 */}
      {searchTerm && (
        <motion.div
          variants={itemVariants}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>搜索结果：</span>
            <span className="font-medium text-blue-600">"{searchTerm}"</span>
            <button
              onClick={() => onSearchChange('')}
              className="text-blue-500 hover:text-blue-600 underline ml-2"
            >
              清除搜索
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoriteFilters; 