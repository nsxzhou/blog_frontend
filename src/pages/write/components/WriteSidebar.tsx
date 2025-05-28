import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Select, Tag, Switch, Button } from 'antd';
import { PictureOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { itemVariants, cardVariants } from '@/constants/animations';
import ImageSelector from './ImageSelector';
import type { ImageInfo } from '@/api/image';

const { Option } = Select;

interface ArticleData {
    category: string;
    isDraft: boolean;
    tags: string[];
    coverImage?: string;
}

interface WriteSidebarProps {
    articleData: ArticleData;
    newTag: string;
    categories: string[];
    popularTags: string[];
    onDataChange: (data: Partial<ArticleData>) => void;
    onNewTagChange: (tag: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

const WriteSidebar: React.FC<WriteSidebarProps> = ({
    articleData,
    newTag,
    categories,
    popularTags,
    onDataChange,
    onNewTagChange,
    onAddTag,
    onRemoveTag,
}) => {
    const [imageSelectorVisible, setImageSelectorVisible] = useState(false);

    // 处理图片选择
    const handleImageSelect = (image: ImageInfo) => {
        onDataChange({ coverImage: image.url });
        setImageSelectorVisible(false);
    };

    // 移除封面图片
    const handleRemoveCover = () => {
        onDataChange({ coverImage: '' });
    };

    return (
        <motion.div
            variants={itemVariants}
            className="space-y-6"
        >
            {/* 发布设置 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">发布设置</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            文章分类
                        </label>
                        <Select
                            placeholder="选择分类"
                            value={articleData.category}
                            onChange={value => onDataChange({ category: value })}
                            className="w-full"
                        >
                            {categories.map(category => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            文章状态
                        </label>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {articleData.isDraft ? '草稿' : '已发布'}
                            </span>
                            <Switch
                                checked={!articleData.isDraft}
                                onChange={checked => onDataChange({ isDraft: !checked })}
                                checkedChildren="发布"
                                unCheckedChildren="草稿"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 标签管理 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>

                {/* 当前标签 */}
                <div className="space-y-3">
                    {articleData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {articleData.tags.map(tag => (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => onRemoveTag(tag)}
                                    className="px-3 py-1 text-sm"
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    )}

                    {/* 添加标签 */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="添加标签"
                            value={newTag}
                            onChange={e => onNewTagChange(e.target.value)}
                            onPressEnter={onAddTag}
                            className="flex-1"
                            size="small"
                        />
                        <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={onAddTag}
                            disabled={!newTag.trim()}
                        />
                    </div>

                    {/* 常用标签 */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">常用标签：</p>
                        <div className="flex flex-wrap gap-1">
                            {popularTags
                                .filter(tag => !articleData.tags.includes(tag))
                                .slice(0, 8)
                                .map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => onDataChange({
                                            tags: [...articleData.tags, tag]
                                        })}
                                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 rounded transition-colors"
                                    >
                                        {tag}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 封面图片 */}
            <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">封面图片</h3>

                {articleData.coverImage ? (
                    // 已选择封面图片
                    <div className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={articleData.coverImage}
                                alt="封面图片"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => setImageSelectorVisible(true)}
                                className="flex-1"
                            >
                                更换封面
                            </Button>
                            <Button
                                size="small"
                                onClick={handleRemoveCover}
                                danger
                            >
                                移除
                            </Button>
                        </div>
                    </div>
                ) : (
                    // 未选择封面图片
                    <button
                        onClick={() => setImageSelectorVisible(true)}
                        className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg 
                                 hover:border-blue-400 hover:bg-blue-50 transition-colors
                                 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600"
                    >
                        <PictureOutlined className="text-2xl mb-2" />
                        <span className="text-sm">选择封面图片</span>
                    </button>
                )}
            </motion.div>

            {/* 图片选择器 */}
            <ImageSelector
                open={imageSelectorVisible}
                onCancel={() => setImageSelectorVisible(false)}
                onSelect={handleImageSelect}
                selectedImageUrl={articleData.coverImage}
            />
        </motion.div>
    );
};

export default WriteSidebar; 