import {
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Checkbox, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react';
import type { ManageComment } from '../types';

interface CommentTableProps {
  comments: ManageComment[];
  loading: boolean;
  selectedIds: number[];
  currentPage: number;
  pageSize: number;
  total: number;
  showArticleColumn?: boolean; // 是否显示文章标题列
  onSelectComment: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  loading,
  selectedIds,
  currentPage,
  pageSize,
  total,
  showArticleColumn = false,
  onSelectComment,
  onSelectAll,
  onApprove,
  onReject,
  onDelete,
  onPageChange,
}) => {
  const baseColumns = [
    {
      title: (
        <Checkbox
          indeterminate={
            selectedIds.length > 0 && selectedIds.length < comments.length
          }
          checked={
            comments.length > 0 && selectedIds.length === comments.length
          }
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      ),
      dataIndex: 'id',
      key: 'select',
      width: showArticleColumn ? '4%' : '5%',
      render: (id: number) => (
        <Checkbox
          checked={selectedIds.includes(id)}
          onChange={(e) => onSelectComment(id, e.target.checked)}
        />
      ),
    },
    {
      title: '用户',
      dataIndex: 'user_name',
      key: 'user_name',
      width: showArticleColumn ? '12%' : '15%',
      render: (name: string, record: ManageComment) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {name || '匿名用户'}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-20">
              {record.user_email}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // 如果需要显示文章列，插入文章标题列
  const articleColumn = showArticleColumn
    ? [
        {
          title: '所属文章',
          dataIndex: 'articleTitle',
          key: 'articleTitle',
          width: '20%',
          render: (title: string) => (
            <div className="flex items-start space-x-2">
              <FileTextOutlined className="text-blue-500 mt-1 flex-shrink-0" />
              <Tooltip title={title}>
                <span className="text-sm text-gray-700 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {title}
                </span>
              </Tooltip>
            </div>
          ),
        },
      ]
    : [];

  const remainingColumns = [
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      width: showArticleColumn ? '28%' : '35%',
      render: (content: string) => (
        <Tooltip title={content}>
          <div className="text-sm text-gray-700 line-clamp-3">{content}</div>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: showArticleColumn ? '8%' : '10%',
      render: (status: string) => {
        const statusConfig = {
          approved: { color: 'green', text: '已通过' },
          pending: { color: 'orange', text: '待审核' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || {
          color: 'default',
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '获赞数',
      dataIndex: 'like_count',
      key: 'like_count',
      width: showArticleColumn ? '6%' : '8%',
      render: (count: number) => (
        <span className="text-sm text-gray-600">{count || 0}</span>
      ),
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: showArticleColumn ? '10%' : '12%',
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <span className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString()}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: showArticleColumn ? '12%' : '15%',
      render: (_: any, record: ManageComment) => (
        <Space size="small">
          {record.status !== 'approved' && (
            <Tooltip title="通过">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                className="text-green-600 hover:text-green-700"
                onClick={() => onApprove(record.id)}
              />
            </Tooltip>
          )}
          {record.status !== 'rejected' && (
            <Tooltip title="拒绝">
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                className="text-orange-600 hover:text-orange-700"
                onClick={() => onReject(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns = [...baseColumns, ...articleColumn, ...remainingColumns];

  return (
    <div className="overflow-hidden">
      <Table
        columns={columns}
        dataSource={comments}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: onPageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条评论`,
        }}
        locale={{
          emptyText: (
            <div className="text-center py-8">
              <CommentOutlined className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">
                {showArticleColumn ? '暂无评论数据' : '这篇文章暂无评论'}
              </p>
            </div>
          ),
        }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => {
            // 处理选择变化
            const newSelectedIds = keys as number[];
            const addedIds = newSelectedIds.filter(
              (id) => !selectedIds.includes(id),
            );
            const removedIds = selectedIds.filter(
              (id) => !newSelectedIds.includes(id),
            );

            addedIds.forEach((id) => onSelectComment(id, true));
            removedIds.forEach((id) => onSelectComment(id, false));
          },
          columnWidth: 50,
        }}
      />
    </div>
  );
};

export default CommentTable;
