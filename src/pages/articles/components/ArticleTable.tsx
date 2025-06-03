import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    Tag,
    Button,
    Dropdown,
    Avatar,
    Tooltip,
    Space,
    Image,
    Modal,
    Input,
    Empty,
    Switch,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    LinkOutlined,
    LockOutlined,
    UnlockOutlined,
    KeyOutlined,
    CopyOutlined,
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    HeartOutlined,
    MessageOutlined,
    StarOutlined,
    PushpinOutlined,
} from '@ant-design/icons';
import { type ArticleListItem } from '@/api/article';
import { fadeInUp, hoverScale, itemVariants } from '@/constants/animations';
import { type StatusConfig, type AccessConfig } from '../types';

interface ArticleTableProps {
    articles: ArticleListItem[];
    batchMode: boolean;
    selectedArticles: number[];
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onSelectionChange: (selectedIds: number[]) => void;
    onPageChange: (page: number, pageSize?: number) => void;
    onEdit: (id: number) => void;
    onView: (id: number) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: 'draft' | 'published') => void;
    onAccessChange: (id: number, access_type: 'public' | 'private' | 'password', password?: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
    articles,
    batchMode,
    selectedArticles,
    pagination,
    onSelectionChange,
    onPageChange,
    onEdit,
    onView,
    onDelete,
    onStatusChange,
    onAccessChange,
}) => {
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState<number>(0);
    const [password, setPassword] = useState('');

    // 状态配置
    const statusConfigs: Record<string, StatusConfig> = {
        published: { color: 'text-green-700', bgColor: 'bg-green-100', text: '已发布' },
        draft: { color: 'text-orange-700', bgColor: 'bg-orange-100', text: '草稿' },
        archived: { color: 'text-red-700', bgColor: 'bg-red-100', text: '已归档' },
    };

    // 访问权限配置
    const accessConfigs: Record<string, AccessConfig> = {
        public: {
            color: 'text-green-700',
            bgColor: 'bg-green-100',
            text: '公开',
            icon: <UnlockOutlined />,
        },
        private: {
            color: 'text-orange-700',
            bgColor: 'bg-orange-100',
            text: '私有',
            icon: <LockOutlined />,
        },
        password: {
            color: 'text-blue-700',
            bgColor: 'bg-blue-100',
            text: '密码',
            icon: <KeyOutlined />,
        },
    };

    // 格式化日期
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 格式化数字
    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // 复制链接
    const handleCopyLink = (id: number) => {
        const url = `${window.location.origin}/article-detail/${id}`;
        navigator.clipboard.writeText(url);
    };

    // 处理访问权限更改
    const handleAccessChange = (id: number, access_type: 'public' | 'private' | 'password') => {
        if (access_type === 'password') {
            setCurrentArticleId(id);
            setPasswordModalVisible(true);
        } else {
            onAccessChange(id, access_type);
        }
    };

    // 确认密码设置
    const handlePasswordConfirm = () => {
        if (password.trim()) {
            onAccessChange(currentArticleId, 'password', password);
            setPasswordModalVisible(false);
            setPassword('');
            setCurrentArticleId(0);
        }
    };

    // 表格列定义
    const columns = [
        // 批量选择列
        ...(batchMode
            ? [
                {
                    title: '选择',
                    dataIndex: 'selection',
                    key: 'selection',
                    width: 60,
                    render: (_: any, record: ArticleListItem) => (
                        <motion.div {...hoverScale}>
                            <input
                                type="checkbox"
                                checked={selectedArticles.includes(record.id)}
                                onChange={(e) => {
                                    const newSelected = e.target.checked
                                        ? [...selectedArticles, record.id]
                                        : selectedArticles.filter((id) => id !== record.id);
                                    onSelectionChange(newSelected);
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                        </motion.div>
                    ),
                },
            ]
            : []),

        // 文章信息列
        {
            title: '文章信息',
            dataIndex: 'title',
            key: 'title',
            width: 400,
            render: (_: any, record: ArticleListItem) => (
                <motion.div
                    variants={itemVariants}
                    className="flex items-start space-x-3"
                >
                    {/* 封面图 */}
                    <div className="flex-shrink-0">
                        {record.cover_image ? (
                            <Image
                                src={record.cover_image}
                                alt={record.title}
                                width={60}
                                height={45}
                                className="rounded-lg object-cover"
                                preview={{
                                    mask: <EyeOutlined />,
                                }}
                            />
                        ) : (
                            <div className="w-15 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileTextOutlined className="text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* 文章信息 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <Tooltip title={record.title}>
                                    <h3
                                        className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => onView(record.id)}
                                    >
                                        {record.is_top === 1 && (
                                            <PushpinOutlined className="text-red-500 mr-1" />
                                        )}
                                        {record.title}
                                    </h3>
                                </Tooltip>

                                <Tooltip title={record.summary}>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {record.summary}
                                    </p>
                                </Tooltip>

                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="text-xs text-gray-500">
                                        {record.word_count} 字
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {record.category_name}
                                    </span>
                                    {record.is_original === 1 && (
                                        <Tag color="green">原创</Tag>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 标签 */}
                        {record.tags && record.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {record.tags.slice(0, 3).map((tag) => (
                                    <Tag key={tag.id} color="blue">
                                        {tag.name}
                                    </Tag>
                                ))}
                                {record.tags.length > 3 && (
                                    <Tag color="default">
                                        +{record.tags.length - 3}
                                    </Tag>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            ),
        },

        // 状态列
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string, record: ArticleListItem) => {
                const config = statusConfigs[status] || statusConfigs.draft;
                return (
                    <motion.div variants={itemVariants}>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'published',
                                        label: '发布',
                                        icon: <FileTextOutlined />,
                                        onClick: () => onStatusChange(record.id, 'published'),
                                    },
                                    {
                                        key: 'draft',
                                        label: '草稿',
                                        icon: <EditOutlined />,
                                        onClick: () => onStatusChange(record.id, 'draft'),
                                    }
                                ],
                            }}
                            trigger={['click']}
                        >
                            <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
                            >
                                {config.text}
                            </div>
                        </Dropdown>
                    </motion.div>
                );
            },
        },

        // 权限列
        {
            title: '权限',
            dataIndex: 'access_type',
            key: 'access_type',
            width: 100,
            render: (access_type: string, record: ArticleListItem) => {
                const config = accessConfigs[access_type] || accessConfigs.public;
                return (
                    <motion.div variants={itemVariants}>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'public',
                                        label: '公开',
                                        icon: <UnlockOutlined />,
                                        onClick: () => handleAccessChange(record.id, 'public'),
                                    },
                                    {
                                        key: 'private',
                                        label: '私有',
                                        icon: <LockOutlined />,
                                        onClick: () => handleAccessChange(record.id, 'private'),
                                    },
                                    {
                                        key: 'password',
                                        label: '密码访问',
                                        icon: <KeyOutlined />,
                                        onClick: () => handleAccessChange(record.id, 'password'),
                                    },
                                ],
                            }}
                            trigger={['click']}
                        >
                            <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity`}
                            >
                                {config.icon}
                                <span className="ml-1">{config.text}</span>
                            </div>
                        </Dropdown>
                    </motion.div>
                );
            },
        },

        // 数据统计列
        {
            title: '数据',
            dataIndex: 'stats',
            key: 'stats',
            width: 120,
            render: (_: any, record: ArticleListItem) => (
                <motion.div variants={itemVariants} className="space-y-1">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {formatNumber(record.view_count)}
                        </span>
                        <span className="flex items-center">
                            <HeartOutlined className="mr-1" />
                            {formatNumber(record.like_count)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                            <MessageOutlined className="mr-1" />
                            {formatNumber(record.comment_count)}
                        </span>
                        <span className="flex items-center">
                            <StarOutlined className="mr-1" />
                            {formatNumber(record.favorite_count)}
                        </span>
                    </div>
                </motion.div>
            ),
        },

        // 时间列
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (_: any, record: ArticleListItem) => (
                <motion.div variants={itemVariants} className="space-y-1">
                    <div className="text-xs text-gray-900">
                        创建: {formatDate(record.created_at)}
                    </div>
                    <div className="text-xs text-gray-500">
                        更新: {formatDate(record.updated_at)}
                    </div>
                    {record.published_at && (
                        <div className="text-xs text-green-600">
                            发布: {formatDate(record.published_at)}
                        </div>
                    )}
                </motion.div>
            ),
        },

        // 操作列
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: any, record: ArticleListItem) => (
                <motion.div variants={itemVariants}>
                    <Space size="small">
                        <Tooltip title="预览">
                            <motion.div {...hoverScale}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => onView(record.id)}
                                    className="text-blue-600 hover:text-blue-700"
                                />
                            </motion.div>
                        </Tooltip>

                        <Tooltip title="编辑">
                            <motion.div {...hoverScale}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(record.id)}
                                    className="text-orange-600 hover:text-orange-700"
                                />
                            </motion.div>
                        </Tooltip>

                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'copy',
                                        label: '复制链接',
                                        icon: <CopyOutlined />,
                                        onClick: () => handleCopyLink(record.id),
                                    },
                                    {
                                        type: 'divider',
                                    },
                                    {
                                        key: 'delete',
                                        label: '删除',
                                        icon: <DeleteOutlined />,
                                        onClick: () => onDelete(record.id),
                                        danger: true,
                                    },
                                ],
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <motion.div {...hoverScale}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MoreOutlined />}
                                    className="text-gray-600 hover:text-gray-700"
                                />
                            </motion.div>
                        </Dropdown>
                    </Space>
                </motion.div>
            ),
        },
    ];

    return (
        <>
            <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <Table
                    columns={columns}
                    dataSource={articles}
                    rowKey="id"
                    pagination={{
                        position: ['bottomCenter'],
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                        onChange: onPageChange,
                        onShowSizeChange: onPageChange,
                    }}
                    scroll={{ x: 1200 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="暂无文章数据"
                            />
                        ),
                    }}
                    size="middle"
                    className="article-table"
                />
            </motion.div>

            {/* 密码设置模态框 */}
            <Modal
                title="设置访问密码"
                open={passwordModalVisible}
                onOk={handlePasswordConfirm}
                onCancel={() => {
                    setPasswordModalVisible(false);
                    setPassword('');
                    setCurrentArticleId(0);
                }}
                okText="确认"
                cancelText="取消"
            >
                <div className="py-4">
                    <Input.Password
                        placeholder="请输入访问密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={20}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        设置后，访问此文章需要输入密码
                    </p>
                </div>
            </Modal>

            <style>{`
                .article-table .ant-table-tbody > tr:hover > td {
                    background-color: #f8fafc !important;
                }
                
                .article-table .ant-table-thead > tr > th {
                    background-color: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                    font-weight: 600;
                    color: #374151;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
};

export default ArticleTable; 