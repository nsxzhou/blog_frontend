import { type ArticleListItem } from '@/api/article';
import { hoverScale } from '@/constants/animations';
import {
  CommentOutlined,
  EyeOutlined,
  LikeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Table } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface ArticleTableProps {
  articles: ArticleListItem[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onSelectArticle: (article: ArticleListItem) => void;
  onPageChange: (page: number) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  loading,
  currentPage,
  pageSize,
  total,
  onSelectArticle,
  onPageChange,
}) => {
  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (title: string, record: ArticleListItem) => (
        <div className="cursor-pointer" onClick={() => onSelectArticle(record)}>
          <motion.div {...hoverScale} className="p-2 -m-2 rounded-lg">
            <h4 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
              {title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {record.summary || '暂无摘要'}
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      key: 'author_name',
      width: '15%',
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-gray-400" />
          <span className="text-gray-700">{name || '未知作者'}</span>
        </div>
      ),
    },
    {
      title: '数据统计',
      key: 'stats',
      width: '20%',
      render: (_: any, record: ArticleListItem) => (
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <EyeOutlined />
            <span>{record.view_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <LikeOutlined />
            <span>{record.like_count || 0}</span>
          </div>
        </div>
      ),
    },
    {
      title: '评论数',
      key: 'comments',
      width: '15%',
      render: (_: any, record: ArticleListItem) => (
        <Badge
          count={record.comment_count || 0}
          showZero
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
    {
      title: '发布时间',
      key: 'date',
      width: '10%',
      render: (_: any, record: ArticleListItem) => (
        <span className="text-sm text-gray-500">
          {new Date(
            record.published_at || record.created_at,
          ).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={articles}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，共 ${total} 篇文章`,
      }}
      locale={{
        emptyText: (
          <div className="text-center py-8">
            <CommentOutlined className="text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">暂无文章</p>
          </div>
        ),
      }}
      className="cursor-pointer"
      onRow={(record) => ({
        onClick: () => onSelectArticle(record),
        className: 'hover:bg-blue-50 transition-colors duration-200',
      })}
    />
  );
};

export default ArticleTable;
