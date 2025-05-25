import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  TagOutlined,
} from '@ant-design/icons';

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const filterButtonVariants = {
  active: {
    scale: 1.05,
    backgroundColor: "#3B82F6",
    color: "#ffffff",
    transition: { duration: 0.2 }
  },
  inactive: {
    scale: 1,
    backgroundColor: "#ffffff",
    color: "#6B7280",
    transition: { duration: 0.2 }
  }
};

const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  allTags,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
}) => {
  const sortOptions = [
    { key: 'date', label: '最新发布', icon: <CalendarOutlined /> },
    { key: 'views', label: '最多阅读', icon: <EyeOutlined /> },
    { key: 'likes', label: '最多点赞', icon: <HeartOutlined /> }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 分类过滤 */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category}
            variants={filterButtonVariants}
            animate={activeCategory === category ? "active" : "inactive"}
            onClick={() => onCategoryChange(category)}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all duration-200 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* 标签过滤 */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-6">
        {allTags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TagOutlined className="mr-1" />
            {tag}
          </motion.button>
        ))}
      </motion.div>

      {/* 排序选项 */}
      <motion.div variants={itemVariants} className="flex justify-center gap-3 mb-8">
        {sortOptions.map((sort) => (
          <motion.button
            key={sort.key}
            onClick={() => onSortChange(sort.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              sortBy === sort.key
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {sort.icon}
            {sort.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default BlogFilters; 