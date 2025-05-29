import type { ArticleListItem } from '@/api/article';
import { Avatar, Button, Pagination, Space, Table, Tag } from 'antd';
import {
  Calendar,
  CheckCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import React from 'react';
import type { ManageComment } from '../types';

interface DataTableProps {
  type: 'articles' | 'comments';
  data: ArticleListItem[] | ManageComment[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedIds?: number[];
  onSelectArticle?: (article: ArticleListItem) => void;
  onSelectComment?: (id: number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onPageChange: (page: number) => void;
}

/**
 * 统一的数据表格组件
 * 根据type属性显示不同的表格内容
 */
export const DataTable: React.FC<DataTableProps> = ({
  type,
  data,
  loading,
  currentPage,
  pageSize,
  total,
  selectedIds = [],
  onSelectArticle,
  onSelectComment,
  onSelectAll,
  onApprove,
  onReject,
  onDelete,
  onPageChange,
}) => {
  // 文章表格列配置
  const articleColumns = [
    {
      title: '文章信息',
      key: 'article',
      render: (record: ArticleListItem) => (
        <div className="flex items-start space-x-3">
          <Avatar
            size={48}
            src={record.cover_image}
            icon={<MessageSquare />}
            className="bg-blue-100"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {record.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {record.summary || '暂无摘要'}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Tag color="blue" className="text-xs">
                <User className="w-3 h-3 inline mr-1" />
                {record.author_name}
              </Tag>
              <Tag color="green" className="text-xs">
                <Calendar className="w-3 h-3 inline mr-1" />
                {record.published_at}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '评论统计',
      key: 'stats',
      width: 120,
      render: (record: ArticleListItem) => (
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {record.comment_count || 0}
          </div>
          <div className="text-xs text-gray-500">条评论</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (record: ArticleListItem) => (
        <Button
          type="primary"
          size="small"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => onSelectArticle?.(record)}
        >
          查看评论
        </Button>
      ),
    },
  ];

  // 评论表格列配置
  const commentColumns = [
    {
      title: '评论信息',
      key: 'comment',
      render: (record: ManageComment) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Avatar size={24} icon={<User />} className="bg-gray-100" />
            <span className="text-sm font-medium">{record.user_name}</span>
            <Tag
              color={
                record.status === 'approved'
                  ? 'green'
                  : record.status === 'pending'
                  ? 'orange'
                  : 'red'
              }
              className="text-xs"
            >
              {record.status === 'approved'
                ? '已通过'
                : record.status === 'pending'
                ? '待审核'
                : '已拒绝'}
            </Tag>
          </div>
          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
            {record.content}
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>
              <Calendar className="w-3 h-3 inline mr-1" />
              {record.created_at}
            </span>
            <span>
              <ThumbsUp className="w-3 h-3 inline mr-1" />
              {record.like_count || 0} 赞
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (record: ManageComment) => (
        <Space direction="vertical" size="small" className="w-full">
          <Space size="small">
            {record.status !== 'approved' && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={() => onApprove?.(record.id)}
              >
                通过
              </Button>
            )}
            {record.status !== 'rejected' && (
              <Button
                size="small"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => onReject?.(record.id)}
              >
                拒绝
              </Button>
            )}
          </Space>
          <Button
            danger
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete?.(record.id)}
            className="w-full"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 评论表格行选择配置
  const commentRowSelection =
    type === 'comments'
      ? {
          selectedRowKeys: selectedIds,
          onChange: (selectedRowKeys: React.Key[]) => {
            const newIds = selectedRowKeys as number[];
            const currentIds = selectedIds;

            // 找出新选中的和取消选中的
            newIds.forEach((id) => {
              if (!currentIds.includes(id)) {
                onSelectComment?.(id, true);
              }
            });

            currentIds.forEach((id) => {
              if (!newIds.includes(id)) {
                onSelectComment?.(id, false);
              }
            });
          },
          onSelectAll: (selected: boolean) => {
            onSelectAll?.(selected);
          },
        }
      : undefined;

  return (
    <div className="space-y-4">
      <Table
        columns={type === 'articles' ? articleColumns : commentColumns}
        dataSource={data as any[]}
        rowKey="id"
        loading={loading}
        pagination={false}
        rowSelection={commentRowSelection}
        className="border border-gray-200 rounded-lg"
        scroll={{ x: 'max-content' }}
      />

      {/* 分页器 */}
      <div className="flex justify-center pt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }
        />
      </div>
    </div>
  );
};
