import { FullTextSearchItem } from '@/api/article/type';
import { fadeInUp } from '@/constants/animations';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Empty, Spin } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface SearchResultsProps {
  results: FullTextSearchItem[];
  loading: boolean;
  keyword: string;
  onResultClick?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  keyword,
  onResultClick,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="text-center py-8 text-gray-500">
        输入关键词开始搜索...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Empty
        description="未找到相关文章"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-4">
        找到 {results.length} 篇相关文章
      </div>
      {results.map((item, index) => (
        <motion.div
          key={item.article_id}
          {...fadeInUp}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <Link
            to={`/article-detail/${item.article_id}`}
            onClick={onResultClick}
            className="block"
          >
            <div
              dangerouslySetInnerHTML={{ __html: item.title }}
              className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors"
            />

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center space-x-1">
                <UserOutlined />
                <span>{item.author_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockCircleOutlined />
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {item.category_name}
              </span>
            </div>

            {/* 搜索片段 */}
            {item.fragments.length > 0 && (
              <div className="space-y-2">
                {item.fragments.slice(0, 2).map((fragment, fragIndex) => (
                  <div
                    key={fragIndex}
                    className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                    dangerouslySetInnerHTML={{ __html: fragment.content }}
                  />
                ))}
              </div>
            )}

            <div className="mt-2 text-xs text-gray-400">
              匹配度: {(item.score * 100).toFixed(1)}%
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default SearchResults;
