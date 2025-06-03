import { Button, Card, Input, Select, Space } from 'antd';
import { CheckCircle, Filter, Search, Trash2, XCircle } from 'lucide-react';
import React from 'react';
import type { BatchAction, FilterType, SortType, ViewMode } from '../types';

const { Search: AntSearch } = Input;
const { Option } = Select;

interface SearchAndFiltersProps {
  viewMode: ViewMode;
  searchTerm: string;
  filterType: FilterType;
  sortType: SortType;
  selectedCommentIds: number[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterType) => void;
  onSortChange: (value: SortType) => void;
  onBatchAction: (action: BatchAction) => void;
}

/**
 * 简化的搜索和过滤组件
 * 统一处理搜索、过滤和批量操作功能
 */
export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  viewMode,
  searchTerm,
  filterType,
  sortType,
  selectedCommentIds,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onBatchAction,
}) => {
  const getSearchPlaceholder = () => {
    switch (viewMode) {
      case 'articles':
        return '搜索文章标题、摘要或作者...';
      case 'comments':
        return '搜索评论内容或用户...';
      default:
        return '搜索内容...';
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-x-4 lg:space-y-0">
        {/* 搜索框 */}
        <div className="flex-1">
          <AntSearch
            placeholder={getSearchPlaceholder()}
            allowClear
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            className="w-full"
          />
        </div>

        {/* 筛选和操作按钮 */}
        <div className="flex items-center space-x-4">
          {viewMode === 'comments' && (
            <>
              {/* 状态筛选 */}
              <Select
                placeholder="筛选状态"
                allowClear
                value={filterType}
                onChange={onFilterChange}
                style={{ width: 120 }}
                suffixIcon={<Filter className="w-4 h-4" />}
              >
                <Option value="">全部</Option>
                <Option value="pending">待审核</Option>
                <Option value="approved">已通过</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>

              {/* 排序方式 */}
              <Select
                placeholder="排序方式"
                value={sortType}
                onChange={onSortChange}
                style={{ width: 120 }}
              >
                <Option value="date">按时间</Option>
                <Option value="likes">按点赞数</Option>
              </Select>

              {/* 批量操作按钮 */}
              {selectedCommentIds.length > 0 && (
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onBatchAction('approve')}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    批量通过 ({selectedCommentIds.length})
                  </Button>
                  <Button
                    size="small"
                    onClick={() => onBatchAction('reject')}
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    批量拒绝
                  </Button>
                  <Button
                    danger
                    size="small"
                    onClick={() => onBatchAction('delete')}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    批量删除
                  </Button>
                </Space>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
