import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Dropdown, Space, Badge, Tooltip } from 'antd';
import {
    CheckSquareOutlined,
    DeleteOutlined,
    EditOutlined,
    FileOutlined,
    InboxOutlined,
    CloseOutlined,
    MoreOutlined,
    BulbOutlined,
} from '@ant-design/icons';
import { fadeInUp, hoverScale, slideInLeft } from '@/constants/animations';
import { type BatchAction } from '../types';

interface ArticleActionsProps {
    batchMode: boolean;
    selectedCount: number;
    onToggleBatchMode: () => void;
    onBatchDelete: () => void;
    onBatchStatusChange: (status: 'draft' | 'published') => void;
    onClearSelection: () => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
    batchMode,
    selectedCount,
    onToggleBatchMode,
    onBatchDelete,
    onBatchStatusChange,
    onClearSelection,
}) => {
    // 批量操作菜单项
    const batchMenuItems = [
        {
            key: 'publish',
            label: '批量发布',
            icon: <FileOutlined />,
            onClick: () => onBatchStatusChange('published'),
            disabled: selectedCount === 0,
        },
        {
            key: 'draft',
            label: '移至草稿',
            icon: <EditOutlined />,
            onClick: () => onBatchStatusChange('draft'),
            disabled: selectedCount === 0,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'delete',
            label: '批量删除',
            icon: <DeleteOutlined />,
            onClick: onBatchDelete,
            disabled: selectedCount === 0,
            danger: true,
        },
    ];

    return (
        <AnimatePresence mode="wait">
            {batchMode ? (
                // 批量操作模式
                <motion.div
                    key="batch-mode"
                    variants={slideInLeft}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <CheckSquareOutlined className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    批量操作模式
                                </span>
                                <Badge
                                    count={selectedCount}
                                    className="ml-2"
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </div>

                            {selectedCount > 0 && (
                                <span className="text-sm text-blue-700">
                                    已选择 {selectedCount} 篇文章
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {selectedCount > 0 && (
                                <>
                                    {/* 快速操作按钮 */}
                                    <motion.div {...hoverScale}>
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<FileOutlined />}
                                            onClick={() => onBatchStatusChange('published')}
                                            className="bg-green-600 border-green-600 hover:bg-green-700"
                                        >
                                            发布
                                        </Button>
                                    </motion.div>

                                    <motion.div {...hoverScale}>
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => onBatchStatusChange('draft')}
                                            className="border-orange-300 text-orange-600 hover:border-orange-400 hover:text-orange-700"
                                        >
                                            草稿
                                        </Button>
                                    </motion.div>

                                    {/* 更多操作下拉菜单 */}
                                    <Dropdown
                                        menu={{
                                            items: batchMenuItems,
                                        }}
                                        trigger={['click']}
                                        placement="bottomRight"
                                    >
                                        <motion.div {...hoverScale}>
                                            <Button
                                                size="small"
                                                icon={<MoreOutlined />}
                                                className="border-gray-300"
                                            >
                                                更多
                                            </Button>
                                        </motion.div>
                                    </Dropdown>

                                    <Tooltip title="清空选择">
                                        <motion.div {...hoverScale}>
                                            <Button
                                                size="small"
                                                icon={<CloseOutlined />}
                                                onClick={onClearSelection}
                                                className="border-gray-300 text-gray-600 hover:border-gray-400"
                                            />
                                        </motion.div>
                                    </Tooltip>
                                </>
                            )}

                            <Tooltip title="退出批量模式">
                                <motion.div {...hoverScale}>
                                    <Button
                                        size="small"
                                        onClick={onToggleBatchMode}
                                        className="border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700"
                                    >
                                        退出批量
                                    </Button>
                                </motion.div>
                            </Tooltip>
                        </div>
                    </div>

                    {/* 批量操作提示 */}
                    {selectedCount === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-3 flex items-center space-x-2 text-blue-600"
                        >
                            <BulbOutlined className="text-sm" />
                            <span className="text-sm">
                                在表格中勾选文章即可进行批量操作
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                // 普通模式
                <motion.div
                    key="normal-mode"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex justify-between items-center"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            管理您的文章，支持批量操作
                        </span>
                    </div>

                    <motion.div {...hoverScale}>
                        <Button
                            icon={<CheckSquareOutlined />}
                            onClick={onToggleBatchMode}
                            className="border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700 rounded-lg"
                        >
                            批量操作
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ArticleActions; 