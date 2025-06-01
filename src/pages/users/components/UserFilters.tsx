import { fadeInUp, hoverScale, itemVariants } from '@/constants/animations';
import {
  CheckCircleOutlined,
  ClearOutlined,
  CrownOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Select, Space, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import { type FilterParams, type SortParams } from '../types';

const { Option } = Select;

interface UserFiltersProps {
  filters: FilterParams;
  sorting: SortParams;
  onFilterChange: (filters: Partial<FilterParams>) => void;
  onSortChange: (sorting: SortParams) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  sorting,
  onFilterChange,
  onSortChange,
}) => {
  // 清空所有筛选条件
  const handleClearFilters = () => {
    onFilterChange({
      keyword: '',
      role: '',
      status: undefined,
    });
    onSortChange({
      order_by: 'created_at',
      order: 'desc',
    });
  };

  // 检查是否有激活的筛选条件
  const hasActiveFilters =
    filters.keyword || filters.role || filters.status !== undefined;

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-sm border-gray-200">
        <div className="flex flex-col gap-4">
          {/* 第一行：搜索框 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div variants={fadeInUp} className="flex-1">
              <Input
                placeholder="搜索用户名、昵称、邮箱..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.keyword}
                onChange={(e) => onFilterChange({ keyword: e.target.value })}
                allowClear
                size="large"
                className="rounded-lg"
              />
            </motion.div>

            <motion.div variants={hoverScale}>
              <Tooltip title="清空所有筛选条件">
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                  className="h-10 px-4"
                >
                  清空筛选
                </Button>
              </Tooltip>
            </motion.div>
          </div>

          {/* 第二行：筛选器和排序 */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* 筛选器组 */}
            <div className="flex flex-wrap gap-3 flex-1">
              {/* 角色筛选 */}
              <motion.div variants={fadeInUp}>
                <Select
                  placeholder="选择角色"
                  value={filters.role || undefined}
                  onChange={(value) => onFilterChange({ role: value || '' })}
                  allowClear
                  className="min-w-[120px]"
                  size="middle"
                >
                  <Option value="admin">
                    <Space>
                      <CrownOutlined className="text-orange-500" />
                      管理员
                    </Space>
                  </Option>
                  <Option value="user">
                    <Space>
                      <UserOutlined className="text-blue-500" />
                      普通用户
                    </Space>
                  </Option>
                </Select>
              </motion.div>

              {/* 状态筛选 */}
              <motion.div variants={fadeInUp}>
                <Select
                  placeholder="选择状态"
                  value={filters.status}
                  onChange={(value) => onFilterChange({ status: value })}
                  allowClear
                  className="min-w-[120px]"
                  size="middle"
                >
                  <Option value={1}>
                    <Space>
                      <CheckCircleOutlined className="text-green-500" />
                      正常
                    </Space>
                  </Option>
                  <Option value={0}>
                    <Space>
                      <StopOutlined className="text-red-500" />
                      禁用
                    </Space>
                  </Option>
                </Select>
              </motion.div>
            </div>

            {/* 排序控件 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm hidden sm:block">
                排序：
              </span>

              <motion.div variants={fadeInUp}>
                <Select
                  value={sorting.order_by}
                  onChange={(value) =>
                    onSortChange({ ...sorting, order_by: value })
                  }
                  className="min-w-[100px]"
                  size="middle"
                >
                  <Option value="created_at">创建时间</Option>
                  <Option value="updated_at">更新时间</Option>
                  <Option value="username">用户名</Option>
                  <Option value="email">邮箱</Option>
                </Select>
              </motion.div>

              <motion.div variants={hoverScale}>
                <Button
                  icon={
                    sorting.order === 'asc' ? (
                      <SortAscendingOutlined />
                    ) : (
                      <SortDescendingOutlined />
                    )
                  }
                  onClick={() =>
                    onSortChange({
                      ...sorting,
                      order: sorting.order === 'asc' ? 'desc' : 'asc',
                    })
                  }
                  title={sorting.order === 'asc' ? '升序' : '降序'}
                  size="middle"
                  className="flex items-center justify-center"
                />
              </motion.div>
            </div>
          </div>

          {/* 激活的筛选条件显示 */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 pt-2 border-t border-gray-100"
            >
              <span className="text-sm text-gray-500 self-center">
                <FilterOutlined className="mr-1" />
                激活的筛选：
              </span>

              {filters.keyword && (
                <motion.div
                  variants={hoverScale}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                >
                  关键词: {filters.keyword}
                </motion.div>
              )}

              {filters.role && (
                <motion.div
                  variants={hoverScale}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm"
                >
                  角色: {filters.role === 'admin' ? '管理员' : '普通用户'}
                </motion.div>
              )}

              {filters.status !== undefined && (
                <motion.div
                  variants={hoverScale}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                >
                  状态: {filters.status === 1 ? '正常' : '禁用'}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default UserFilters;
