import type { ArticleListItem } from '@/api/article';
import { UserAvatar } from '@/components/ui';
import { Button, Pagination, Table, Tag } from 'antd';
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
const DataTable: React.FC<DataTableProps> = ({
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
        <div className="flex items-start space-x-4 p-4">
          <UserAvatar
            size="sm"
            src={record.cover_image}
            user={{
              name: record.author_name,
            }}
            className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-100 shadow-sm"
          />
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h4 className="text-base font-semibold text-gray-900 truncate leading-tight">
                {record.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                {record.summary || '暂无摘要'}
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <Tag
                color="blue"
                className="text-xs px-2 py-1 rounded-full border-0 bg-blue-50 text-blue-700 font-medium"
              >
                <User className="w-3 h-3 inline mr-1.5" />
                {record.author_name}
              </Tag>
              <Tag
                color="green"
                className="text-xs px-2 py-1 rounded-full border-0 bg-emerald-50 text-emerald-700 font-medium"
              >
                <Calendar className="w-3 h-3 inline mr-1.5" />
                {new Date(record.published_at).toLocaleDateString('zh-CN')}
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
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {record.comment_count || 0}
          </div>
          <div className="text-xs text-gray-500 font-medium">条评论</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (record: ArticleListItem) => (
        <div className="py-4">
          <Button
            type="primary"
            size="middle"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => onSelectArticle?.(record)}
            className="bg-blue-600 hover:bg-blue-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
          >
            查看评论
          </Button>
        </div>
      ),
    },
  ];

  // 评论表格列配置
  const commentColumns = [
    {
      title: '评论信息',
      key: 'comment',
      render: (record: ManageComment) => (
        <div className="space-y-4 p-1">
          {/* 用户信息和状态行 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserAvatar
                size="sm"
                user={record.user}
                className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {record.user_name}
                </span>
                <span className="text-xs text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1.5" />
                  {new Date(record.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <Tag
              color={
                record.status === 'approved'
                  ? 'success'
                  : record.status === 'pending'
                  ? 'warning'
                  : 'error'
              }
              className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${
                record.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700'
                  : record.status === 'pending'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {record.status === 'approved'
                ? '✓ 已通过'
                : record.status === 'pending'
                ? '⏳ 待审核'
                : '✗ 已拒绝'}
            </Tag>
          </div>

          {/* 评论内容 */}
          <div className="relative">
            <div className="text-sm text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200/50 leading-relaxed shadow-sm">
              <div className="absolute top-0 left-4 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transform -translate-y-1"></div>
              <div className="pl-3">{record.content}</div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-100/80 px-2.5 py-1.5 rounded-full">
                <ThumbsUp className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium">{record.like_count || 0} 赞</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-100/80 px-2.5 py-1.5 rounded-full">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium">ID: {record.id}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (record: ManageComment) => (
        <div className="space-y-3 p-2">
          {/* 审核操作 */}
          <div className="flex flex-col space-y-2">
            {record.status !== 'approved' && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={() => onApprove?.(record.id)}
                className="bg-emerald-600 hover:bg-emerald-700 border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg font-medium h-8"
              >
                通过审核
              </Button>
            )}
            {record.status !== 'rejected' && (
              <Button
                size="small"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => onReject?.(record.id)}
                className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg font-medium h-8"
              >
                拒绝审核
              </Button>
            )}
          </div>

          {/* 删除操作 */}
          <div className="border-t border-gray-100 pt-2">
            <Button
              danger
              size="small"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => onDelete?.(record.id)}
              className="w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg font-medium h-8"
            >
              删除评论
            </Button>
          </div>
        </div>
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

export default DataTable;