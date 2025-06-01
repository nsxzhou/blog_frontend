import { hoverScale, itemVariants } from '@/constants/animations';
import {
  CheckOutlined,
  ClearOutlined,
  DeleteOutlined,
  SelectOutlined,
  SettingOutlined,
  StopOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Badge, Button, Divider, Space, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface UserActionsProps {
  selectedUsers: number[];
  batchMode: boolean;
  onBatchModeChange: (enabled: boolean) => void;
  onBatchAction: (action: 'enable' | 'disable' | 'delete') => void;
  onSelectionClear: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  selectedUsers,
  batchMode,
  onBatchModeChange,
  onBatchAction,
  onSelectionClear,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 左侧：批量操作 */}
        <div className="flex items-center gap-4">
          <motion.div variants={hoverScale}>
            <Button
              type={batchMode ? 'primary' : 'default'}
              icon={<SelectOutlined />}
              onClick={() => onBatchModeChange(!batchMode)}
              className="flex items-center gap-2"
            >
              批量管理
              {batchMode && selectedUsers.length > 0 && (
                <Badge
                  count={selectedUsers.length}
                  size="small"
                  style={{
                    backgroundColor: '#fff',
                    color: '#1890ff',
                    boxShadow: '0 0 0 1px #1890ff inset',
                  }}
                />
              )}
            </Button>
          </motion.div>

          {batchMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <Divider type="vertical" className="h-8" />

              <Space size="small">
                <Tooltip title="启用选中用户">
                  <motion.div variants={hoverScale}>
                    <Button
                      icon={<CheckOutlined />}
                      size="small"
                      disabled={selectedUsers.length === 0}
                      onClick={() => onBatchAction('enable')}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      启用 ({selectedUsers.length})
                    </Button>
                  </motion.div>
                </Tooltip>

                <Tooltip title="禁用选中用户">
                  <motion.div variants={hoverScale}>
                    <Button
                      icon={<StopOutlined />}
                      size="small"
                      disabled={selectedUsers.length === 0}
                      onClick={() => onBatchAction('disable')}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      禁用 ({selectedUsers.length})
                    </Button>
                  </motion.div>
                </Tooltip>

                <Tooltip title="删除选中用户">
                  <motion.div variants={hoverScale}>
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      disabled={selectedUsers.length === 0}
                      onClick={() => onBatchAction('delete')}
                    >
                      删除 ({selectedUsers.length})
                    </Button>
                  </motion.div>
                </Tooltip>

                <Tooltip title="清空选择">
                  <motion.div variants={hoverScale}>
                    <Button
                      icon={<ClearOutlined />}
                      size="small"
                      disabled={selectedUsers.length === 0}
                      onClick={onSelectionClear}
                    >
                      清空
                    </Button>
                  </motion.div>
                </Tooltip>
              </Space>
            </motion.div>
          )}
        </div>

        {/* 右侧：其他操作 */}
        <div className="flex items-center gap-3">
          <Tooltip title="系统设置">
            <motion.div variants={hoverScale}>
              <Button
                icon={<SettingOutlined />}
                type="text"
                className="text-gray-600 hover:text-blue-600"
              />
            </motion.div>
          </Tooltip>

          <Tooltip title="邀请用户">
            <motion.div variants={hoverScale}>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                邀请用户
              </Button>
            </motion.div>
          </Tooltip>
        </div>
      </div>

      {/* 批量操作提示 */}
      {batchMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <SelectOutlined className="text-sm" />
            <span className="text-sm">
              批量管理模式已启用，请选择要操作的用户。已选择
              <strong className="mx-1">{selectedUsers.length}</strong>
              个用户。
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserActions;
