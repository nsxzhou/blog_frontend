import { hoverScale } from '@/constants/animations';
import {
  DeleteOutlined,
  HistoryOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface ReadingHistoryHeaderProps {
  totalCount: number;
  selectedCount: number;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onSelectAll: (checked: boolean) => void;
  onBatchDelete: () => void;
  onClearAll: () => void;
  batchDeleteLoading: boolean;
  clearLoading: boolean;
}

const ReadingHistoryHeader: React.FC<ReadingHistoryHeaderProps> = ({
  totalCount,
  selectedCount,
  isSelectionMode,
  onToggleSelectionMode,
  onSelectAll,
  onBatchDelete,
  onClearAll,
  batchDeleteLoading,
  clearLoading,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 左侧标题和统计 */}
        <div className="flex items-center gap-4">
          <motion.div
            variants={hoverScale}
            whileHover="whileHover"
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
          >
            <HistoryOutlined className="text-white text-xl" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">阅读历史</h1>
            <p className="text-gray-600 mt-1">
              {totalCount > 0 ? (
                <>
                  共有{' '}
                  <span className="font-medium text-blue-600">
                    {totalCount}
                  </span>{' '}
                  条阅读记录
                  {isSelectionMode && selectedCount > 0 && (
                    <>
                      ，已选择{' '}
                      <span className="font-medium text-orange-600">
                        {selectedCount}
                      </span>{' '}
                      条
                    </>
                  )}
                </>
              ) : (
                '暂无阅读记录'
              )}
            </p>
          </div>
        </div>

        {/* 右侧操作按钮 */}
        {totalCount > 0 && (
          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <>
                <Checkbox
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={selectedCount > 0 && selectedCount === totalCount}
                  indeterminate={
                    selectedCount > 0 && selectedCount < totalCount
                  }
                >
                  全选
                </Checkbox>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onBatchDelete}
                  loading={batchDeleteLoading}
                  disabled={selectedCount === 0}
                >
                  删除选中 ({selectedCount})
                </Button>
                <Button onClick={onToggleSelectionMode}>取消选择</Button>
              </>
            ) : (
              <>
                <Button
                  icon={<SelectOutlined />}
                  onClick={onToggleSelectionMode}
                >
                  批量管理
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onClearAll}
                  loading={clearLoading}
                >
                  清空全部
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistoryHeader;
