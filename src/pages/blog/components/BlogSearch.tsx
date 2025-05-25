import React from 'react';
import { motion } from 'framer-motion';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
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

const BlogSearch: React.FC<BlogSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="max-w-md mx-auto mb-8"
    >
      <Input
        size="large"
        placeholder="搜索文章..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-xl shadow-sm"
      />
    </motion.div>
  );
};

export default BlogSearch; 