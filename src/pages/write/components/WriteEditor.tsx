import React from 'react';
import { motion } from 'framer-motion';
import { Input } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { itemVariants, cardVariants } from '@/constants/animations';

const { TextArea } = Input;

interface WriteEditorProps {
    title: string;
    excerpt: string;
    content: string;
    previewMode: boolean;
    onTitleChange: (title: string) => void;
    onExcerptChange: (excerpt: string) => void;
    onContentChange: (content: string) => void;
}

const WriteEditor: React.FC<WriteEditorProps> = ({
    title,
    excerpt,
    content,
    previewMode,
    onTitleChange,
    onExcerptChange,
    onContentChange,
}) => {
    return (
        <motion.div
            variants={itemVariants}
            className="lg:col-span-3 space-y-6"
        >
            {/* 标题输入 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <Input
                    placeholder="请输入文章标题..."
                    value={title}
                    onChange={e => onTitleChange(e.target.value)}
                    className="text-2xl font-bold border-0 shadow-none p-0 placeholder:text-gray-400"
                    style={{ fontSize: '24px', lineHeight: '1.4' }}
                />
            </motion.div>

            {/* 摘要输入 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <TextArea
                    placeholder="请输入文章摘要..."
                    value={excerpt}
                    onChange={e => onExcerptChange(e.target.value)}
                    rows={3}
                    className="border-0 shadow-none resize-none placeholder:text-gray-400"
                    style={{ fontSize: '16px' }}
                />
            </motion.div>

            {/* MD编辑器 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="h-[600px]">
                    <MDEditor
                        value={content}
                        onChange={(value = '') => onContentChange(value)}
                        preview={previewMode ? 'preview' : 'edit'}
                        hideToolbar={false}
                        height={600}
                        data-color-mode="light"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default WriteEditor; 