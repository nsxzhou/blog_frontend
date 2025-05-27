import React from 'react';
import { motion } from 'framer-motion';
import { Button, Divider, Tooltip } from 'antd';
import {
    SaveOutlined,
    SendOutlined,
    EyeOutlined,
    ArrowLeftOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { fadeInUp, hoverScale } from '@/constants/animations';

interface WriteHeaderProps {
    editId: string | null;
    saving: boolean;
    loading: boolean;
    previewMode: boolean;
    onBack: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    onTogglePreview: () => void;
    onOpenSettings: () => void;
}

const WriteHeader: React.FC<WriteHeaderProps> = ({
    editId,
    saving,
    loading,
    previewMode,
    onBack,
    onSaveDraft,
    onPublish,
    onTogglePreview,
    onOpenSettings,
}) => {
    return (
        <motion.header
            variants={fadeInUp}
            className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* 左侧操作 */}
                    <div className="flex items-center space-x-4">
                        <motion.div {...hoverScale}>
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={onBack}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                返回
                            </Button>
                        </motion.div>

                        <Divider type="vertical" />

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                                {editId ? '编辑文章' : '写新文章'}
                            </span>
                            {saving && (
                                <span className="text-xs text-blue-500">正在保存...</span>
                            )}
                        </div>
                    </div>

                    {/* 右侧操作 */}
                    <div className="flex items-center space-x-3">
                        <motion.div {...hoverScale}>
                            <Tooltip title="文章设置">
                                <Button
                                    type="text"
                                    icon={<SettingOutlined />}
                                    onClick={onOpenSettings}
                                    className="text-gray-600 hover:text-gray-900"
                                />
                            </Tooltip>
                        </motion.div>

                        <motion.div {...hoverScale}>
                            <Tooltip title="预览">
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={onTogglePreview}
                                    className={`${previewMode ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:text-blue-700`}
                                />
                            </Tooltip>
                        </motion.div>

                        <motion.div {...hoverScale}>
                            <Button
                                loading={saving}
                                icon={<SaveOutlined />}
                                onClick={onSaveDraft}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                保存草稿
                            </Button>
                        </motion.div>

                        <motion.div {...hoverScale}>
                            <Button
                                type="primary"
                                loading={loading}
                                icon={<SendOutlined />}
                                onClick={onPublish}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                发布文章
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default WriteHeader;