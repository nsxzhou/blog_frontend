import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { message, Spin, Modal, Empty } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    SearchOutlined,
    FolderOutlined
} from '@ant-design/icons';
import {
    GetCategoryList,
    DeleteCategory,
    UpdateCategory,
    type CategoryInfo,
    type GetCategoryListReq
} from '@/api/category';
import {
    containerVariants,
    itemVariants,
    cardHover,
    fadeInUp,
    hoverScale
} from '@/constants/animations';
import CategoryForm from './components/CategoryForm';
import CategoryStats from './components/CategoryStats';
import SearchAndFilter from './components/SearchAndFilter';


const CategoryManagementPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });

    // 获取分类列表
    const fetchCategories = async (params?: GetCategoryListReq) => {
        setLoading(true);
        try {
            const response = await GetCategoryList({
                page: pagination.current,
                page_size: pagination.pageSize,
                keyword: searchTerm || undefined,
                is_visible: visibilityFilter === 'all' ? undefined : (visibilityFilter === 'visible' ? 1 : 0),
                ...params
            });

            if (response.code === 0) {
                setCategories(response.data.categories);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination.total,
                    current: response.data.pagination.current_page
                }));
            }
        } catch (error) {
            message.error('获取分类列表失败');
            console.error('获取分类列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 初始化加载
    useEffect(() => {
        fetchCategories();
    }, []);

    // 搜索和筛选变化时重新加载
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPagination(prev => ({ ...prev, current: 1 }));
            fetchCategories({ page: 1 });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, visibilityFilter]);

    // 计算统计数据
    const stats = useMemo(() => {
        const total = categories.length;
        const visible = categories.filter(cat => cat.is_visible === 1).length;
        const hidden = categories.filter(cat => cat.is_visible === 0).length;

        return {
            total,
            visible,
            hidden,
            recentlyAdded: categories.filter(cat => {
                const createDate = new Date(cat.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createDate > weekAgo;
            }).length
        };
    }, [categories]);

    // 处理创建分类
    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsFormModalOpen(true);
    };

    // 处理编辑分类
    const handleEditCategory = (category: CategoryInfo) => {
        setEditingCategory(category);
        setIsFormModalOpen(true);
    };

    // 处理删除分类
    const handleDeleteCategory = (category: CategoryInfo) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除分类"${category.name}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    const response = await DeleteCategory(category.id);
                    if (response.code === 0) {
                        message.success('分类删除成功');
                        fetchCategories();
                    }
                } catch (error) {
                    message.error('删除分类失败');
                    console.error('删除分类失败:', error);
                }
            }
        });
    };

    // 处理切换可见性
    const handleToggleVisibility = async (category: CategoryInfo) => {
        try {
            const response = await UpdateCategory(category.id, {
                is_visible: category.is_visible === 1 ? 0 : 1
            });

            if (response.code === 0) {
                message.success(`分类${category.is_visible === 1 ? '隐藏' : '显示'}成功`);
                fetchCategories();
            }
        } catch (error) {
            message.error('操作失败');
            console.error('切换可见性失败:', error);
        }
    };

    // 处理表单提交成功
    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    // 处理分页变化
    const handlePageChange = (page: number, pageSize?: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize || prev.pageSize
        }));
        fetchCategories({ page, page_size: pageSize });
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gray-50 py-8"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 页面标题 */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FolderOutlined className="text-blue-600" />
                                分类管理
                            </h1>
                            <p className="text-gray-600 mt-2">管理博客分类，组织内容结构</p>
                        </div>
                        <motion.button
                            {...hoverScale}
                            onClick={handleCreateCategory}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            <PlusOutlined />
                            创建分类
                        </motion.button>
                    </div>
                </motion.div>

                {/* 统计卡片 */}
                <motion.div variants={itemVariants} className="mb-8">
                    <CategoryStats stats={stats} />
                </motion.div>

                {/* 搜索和筛选 */}
                <motion.div variants={itemVariants} className="mb-8">
                    <SearchAndFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        visibilityFilter={visibilityFilter}
                        onVisibilityFilterChange={setVisibilityFilter}
                    />
                </motion.div>

                {/* 分类列表 */}
                <motion.div variants={itemVariants}>
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : categories.length === 0 ? (
                        <motion.div
                            {...fadeInUp}
                            className="bg-white rounded-xl p-12 text-center shadow-sm"
                        >
                            <Empty
                                description="暂无分类"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <motion.button
                                    {...hoverScale}
                                    onClick={handleCreateCategory}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    创建第一个分类
                                </motion.button>
                            </Empty>
                        </motion.div>
                    ) : (
                        <>
                            {/* 分类网格 */}
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                variants={containerVariants}
                            >
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={category.id}
                                        variants={itemVariants}
                                        custom={index}
                                        {...cardHover}
                                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* 分类图标和标题 */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                                                    {category.icon || '📁'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {category.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.is_visible === 1
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {category.is_visible === 1 ? '可见' : '隐藏'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 分类描述 */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                                            {category.description || '暂无描述'}
                                        </p>

                                        {/* 创建时间 */}
                                        <div className="text-xs text-gray-400 mb-4">
                                            创建于 {new Date(category.created_at).toLocaleDateString()}
                                        </div>

                                        {/* 操作按钮 */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEditCategory(category)}
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="编辑"
                                                >
                                                    <EditOutlined />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleToggleVisibility(category)}
                                                    className={`p-2 rounded-lg transition-colors ${category.is_visible === 1
                                                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                                        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    title={category.is_visible === 1 ? '隐藏' : '显示'}
                                                >
                                                    {category.is_visible === 1 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </motion.button>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteCategory(category)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="删除"
                                            >
                                                <DeleteOutlined />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* 分页 */}
                            {pagination.total > pagination.pageSize && (
                                <motion.div
                                    {...fadeInUp}
                                    className="mt-8 flex justify-center"
                                >
                                    <div className="bg-white rounded-lg px-6 py-4 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <button
                                                disabled={pagination.current === 1}
                                                onClick={() => handlePageChange(pagination.current - 1)}
                                                className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                上一页
                                            </button>
                                            <span className="text-gray-600">
                                                第 {pagination.current} 页，共 {Math.ceil(pagination.total / pagination.pageSize)} 页
                                            </span>
                                            <button
                                                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                                                onClick={() => handlePageChange(pagination.current + 1)}
                                                className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                下一页
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>

            {/* 分类表单模态框 */}
            <Modal
                title={editingCategory ? '编辑分类' : '创建分类'}
                open={isFormModalOpen}
                onCancel={() => setIsFormModalOpen(false)}
                footer={null}
                width={600}
                destroyOnClose
            >
                <CategoryForm
                    category={editingCategory}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            </Modal>
        </motion.div>
    );
};

export default CategoryManagementPage;