import { hoverScale, itemVariants } from '@/constants/animations';
import {
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Input, Select } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import type { ImageFiltersProps } from './types';
import { SORT_OPTIONS, STORAGE_TYPES, USAGE_TYPES } from './types';

const { Search } = Input;
const { RangePicker } = DatePicker;

const ImageFilters: React.FC<ImageFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onBatchDelete,
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      {/* 搜索栏 */}
      <div className="mb-6">
        <Search
          placeholder="搜索图片名称..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          size="large"
          prefix={<SearchOutlined className="text-gray-400" />}
          className="max-w-md"
        />
      </div>

      {/* 过滤器和操作栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* 过滤器 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FilterOutlined className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">过滤:</span>
          </div>

          <Select
            value={filters.usageType}
            onChange={(value) =>
              onFilterChange({ ...filters, usageType: value })
            }
            className="min-w-[120px]"
            placeholder="使用类型"
          >
            {USAGE_TYPES.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={filters.storageType}
            onChange={(value) =>
              onFilterChange({ ...filters, storageType: value })
            }
            className="min-w-[120px]"
            placeholder="存储类型"
          >
            {STORAGE_TYPES.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            onChange={(dates) => {
              const dateRange =
                dates && dates[0] && dates[1]
                  ? ([
                      dates[0].format('YYYY-MM-DD'),
                      dates[1].format('YYYY-MM-DD'),
                    ] as [string, string])
                  : null;
              onFilterChange({ ...filters, dateRange });
            }}
            placeholder={['开始日期', '结束日期']}
            className="min-w-[200px]"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">排序:</span>
            <Select
              value={sortBy}
              onChange={onSortChange}
              className="min-w-[100px]"
            >
              {SORT_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="flex items-center gap-4">
          {/* 全选操作 */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => onSelectAll(e.target.checked)}
            >
              <span className="text-sm text-gray-600">
                {selectedCount > 0
                  ? `已选择 ${selectedCount} 项`
                  : `全选 (${totalCount})`}
              </span>
            </Checkbox>
          </div>

          {/* 批量操作 */}
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <motion.div variants={hoverScale}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onBatchDelete}
                  size="small"
                >
                  批量删除
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* 统计信息 */}
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
            共 {totalCount} 张图片
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageFilters;
