import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Input,
    Select,
    DatePicker,
    Button,
    Space,
    Tag,
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    CalendarOutlined,
    ClearOutlined,
} from '@ant-design/icons';
import { fadeInUp, hoverScale } from '@/constants/animations';
import { type FilterParams, type SortParams } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ArticleFiltersProps {
    filters: FilterParams;
    sorting: SortParams;
    onFilterChange: (filters: Partial<FilterParams>) => void;
    onSortChange: (sorting: SortParams) => void;
    onCreateNew: () => void;
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({
    filters,
    sorting,
    onFilterChange,
    onSortChange,
    onCreateNew,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // 状态选项
    const statusOptions = [
        { value: 'all', label: '全部状态', color: 'default' },
        { value: 'published', label: '已发布', color: 'green' },
        { value: 'draft', label: '草稿', color: 'orange' },
        { value: 'archived', label: '已归档', color: 'red' },
    ];

    // 访问权限选项
    const accessOptions = [
        { value: 'all', label: '全部权限', color: 'default' },
        { value: 'public', label: '公开', color: 'green' },
        { value: 'private', label: '私有', color: 'orange' },
        { value: 'password', label: '密码访问', color: 'blue' },
    ];

    // 排序选项
    const sortOptions = [
        { value: 'created_at', label: '创建时间' },
        { value: 'updated_at', label: '更新时间' },
        { value: 'published_at', label: '发布时间' },
        { value: 'view_count', label: '浏览量' },
        { value: 'like_count', label: '点赞数' },
        { value: 'title', label: '标题' },
    ];

    // 清空筛选条件
    const handleClearFilters = () => {
        onFilterChange({
            keyword: '',
            status: 'all',
            category_id: undefined,
            tag_id: undefined,
            access_type: 'all',
            is_top: undefined,
            is_original: undefined,
            start_date: '',
            end_date: '',
        });
    };

    // 检查是否有活动的筛选条件
    const hasActiveFilters =
        filters.keyword ||
        filters.status !== 'all' ||
        filters.category_id ||
        filters.tag_id ||
        filters.access_type !== 'all' ||
        filters.is_top !== undefined ||
        filters.is_original !== undefined ||
        filters.start_date ||
        filters.end_date;

    return (
        <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
            {/* 主要筛选栏 */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* 搜索框 */}
                    <div className="relative flex-1 max-w-md">
                        <Input
                            placeholder="搜索文章标题、内容..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={filters.keyword}
                            onChange={(e) => onFilterChange({ keyword: e.target.value })}
                            allowClear
                            className="rounded-lg"
                        />
                    </div>

                    {/* 快速筛选 */}
                    <div className="flex gap-2">
                        <Select
                            value={filters.status}
                            onChange={(value) => onFilterChange({ status: value })}
                            className="w-32"
                        >
                            {statusOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    <Tag color={option.color} className="border-0">
                                        {option.label}
                                    </Tag>
                                </Option>
                            ))}
                        </Select>

                        <Select
                            value={sorting.order_by}
                            onChange={(value) => onSortChange({ ...sorting, order_by: value })}
                            className="w-32"
                            suffixIcon={<SortAscendingOutlined />}
                        >
                            {sortOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            value={sorting.order}
                            onChange={(value) => onSortChange({ ...sorting, order: value })}
                            className="w-24"
                        >
                            <Option value="desc">降序</Option>
                            <Option value="asc">升序</Option>
                        </Select>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                    <Tooltip title="展开高级筛选">
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setIsExpanded(!isExpanded)}
                            type={isExpanded ? 'primary' : 'default'}
                            className="rounded-lg"
                        >
                            高级筛选
                        </Button>
                    </Tooltip>

                    {hasActiveFilters && (
                        <Tooltip title="清空筛选条件">
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                className="rounded-lg"
                            >
                                清空
                            </Button>
                        </Tooltip>
                    )}

                    <motion.div {...hoverScale}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onCreateNew}
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 rounded-lg"
                        >
                            写文章
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* 高级筛选面板 */}
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 访问权限 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                访问权限
                            </label>
                            <Select
                                value={filters.access_type}
                                onChange={(value) => onFilterChange({ access_type: value })}
                                className="w-full"
                                placeholder="选择访问权限"
                            >
                                {accessOptions.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        <Tag color={option.color} className="border-0">
                                            {option.label}
                                        </Tag>
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* 置顶状态 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                置顶状态
                            </label>
                            <Select
                                value={filters.is_top}
                                onChange={(value) => onFilterChange({ is_top: value })}
                                className="w-full"
                                placeholder="选择置顶状态"
                                allowClear
                            >
                                <Option value={1}>
                                    <Tag color="red" className="border-0">置顶</Tag>
                                </Option>
                                <Option value={0}>
                                    <Tag color="default" className="border-0">普通</Tag>
                                </Option>
                            </Select>
                        </div>

                        {/* 原创状态 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                原创状态
                            </label>
                            <Select
                                value={filters.is_original}
                                onChange={(value) => onFilterChange({ is_original: value })}
                                className="w-full"
                                placeholder="选择原创状态"
                                allowClear
                            >
                                <Option value={1}>
                                    <Tag color="green" className="border-0">原创</Tag>
                                </Option>
                                <Option value={0}>
                                    <Tag color="orange" className="border-0">转载</Tag>
                                </Option>
                            </Select>
                        </div>

                        {/* 时间范围 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                创建时间
                            </label>
                            <RangePicker
                                className="w-full"
                                placeholder={['开始日期', '结束日期']}
                                suffixIcon={<CalendarOutlined />}
                                onChange={(dates, dateStrings) => {
                                    onFilterChange({
                                        start_date: dateStrings[0],
                                        end_date: dateStrings[1],
                                    });
                                }}
                            />
                        </div>
                    </div>

                    {/* 活动筛选条件显示 */}
                    {hasActiveFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">活动筛选条件:</span>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={handleClearFilters}
                                    className="text-blue-600"
                                >
                                    清空全部
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filters.keyword && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ keyword: '' })}
                                        color="blue"
                                    >
                                        关键词: {filters.keyword}
                                    </Tag>
                                )}
                                {filters.status !== 'all' && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ status: 'all' })}
                                        color="green"
                                    >
                                        状态: {statusOptions.find(o => o.value === filters.status)?.label}
                                    </Tag>
                                )}
                                {filters.access_type !== 'all' && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ access_type: 'all' })}
                                        color="orange"
                                    >
                                        权限: {accessOptions.find(o => o.value === filters.access_type)?.label}
                                    </Tag>
                                )}
                                {filters.is_top !== undefined && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ is_top: undefined })}
                                        color="red"
                                    >
                                        {filters.is_top ? '置顶' : '普通'}
                                    </Tag>
                                )}
                                {filters.is_original !== undefined && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ is_original: undefined })}
                                        color="purple"
                                    >
                                        {filters.is_original ? '原创' : '转载'}
                                    </Tag>
                                )}
                                {(filters.start_date || filters.end_date) && (
                                    <Tag
                                        closable
                                        onClose={() => onFilterChange({ start_date: '', end_date: '' })}
                                        color="cyan"
                                    >
                                        时间: {filters.start_date} ~ {filters.end_date}
                                    </Tag>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ArticleFilters; 