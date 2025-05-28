import React from 'react';
import { motion } from 'framer-motion';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { itemVariants } from '@/constants/animations';

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  searchTerm,
  onSearchChange,
  loading = false
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="max-w-md mx-auto mb-8"
    >
      <Input
        size="large"
        placeholder="搜索文章..."
        prefix={
          loading ? (
            <LoadingOutlined className="text-blue-500" />
          ) : (
            <SearchOutlined className="text-gray-400" />
          )
        }
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-xl shadow-sm"
        disabled={loading}
      />
    </motion.div>
  );
};

export default BlogSearch; 