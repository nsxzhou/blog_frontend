import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Switch, Button, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CreateCategory, UpdateCategory, type CategoryInfo, type CreateCategoryReq } from '@/api/category';
import { fadeInUp, hoverScale } from '@/constants/animations';

interface CategoryFormProps {
    category?: CategoryInfo | null;
    onSuccess: () => void;
    onCancel: () => void;
}

interface FormValues {
    name: string;
    description: string;
    icon: string;
    is_visible: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    // 初始化表单数据
    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description,
                icon: category.icon,
                is_visible: category.is_visible === 1,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                is_visible: true, // 默认可见
            });
        }
    }, [category, form]);

    // 处理表单提交
    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const requestData: CreateCategoryReq = {
                name: values.name.trim(),
                description: values.description.trim(),
                icon: values.icon.trim(),
                is_visible: values.is_visible ? 1 : 0,
            };

            if (category) {
                // 编辑分类
                const response = await UpdateCategory(category.id, requestData);
                if (response.code === 0) {
                    message.success('分类更新成功');
                    onSuccess();
                }
            } else {
                // 创建分类
                const response = await CreateCategory(requestData);
                if (response.code === 0) {
                    message.success('分类创建成功');
                    onSuccess();
                }
            }
        } catch (error) {
            message.error(category ? '更新分类失败' : '创建分类失败');
            console.error('表单提交失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 处理表单失败
    const handleSubmitFailed = (errorInfo: any) => {
        console.log('表单验证失败:', errorInfo);
        message.error('请检查表单填写是否正确');
    };

    return (
        <motion.div {...fadeInUp} className="p-6">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={handleSubmitFailed}
                autoComplete="off"
            >
                {/* 分类名称 */}
                <Form.Item
                    name="name"
                    label="分类名称"
                    rules={[
                        { required: true, message: '请输入分类名称' },
                        { min: 2, max: 50, message: '分类名称长度应在2-50个字符之间' },
                    ]}
                >
                    <Input
                        placeholder="请输入分类名称"
                        size="large"
                        maxLength={50}
                        showCount
                    />
                </Form.Item>

                {/* 分类描述 */}
                <Form.Item
                    name="description"
                    label="分类描述"
                    rules={[
                        { required: true, message: '请输入分类描述' },
                        { min: 5, max: 200, message: '分类描述长度应在5-200个字符之间' },
                    ]}
                >
                    <Input.TextArea
                        placeholder="请输入分类描述"
                        size="large"
                        rows={4}
                        maxLength={200}
                        showCount
                    />
                </Form.Item>

                {/* 分类图标 */}
                <Form.Item
                    name="icon"
                    label="分类图标"
                    rules={[
                        { required: true, message: '请输入分类图标' },
                    ]}
                    extra="可以使用 emoji 或者单个字符作为图标"
                >
                    <Input
                        placeholder="请输入分类图标（如：📁、🚀、💻）"
                        size="large"
                        maxLength={10}
                    />
                </Form.Item>

                {/* 是否可见 */}
                <Form.Item
                    name="is_visible"
                    label="是否可见"
                    valuePropName="checked"
                    extra="设置分类是否在前台显示"
                >
                    <Switch
                        checkedChildren="可见"
                        unCheckedChildren="隐藏"
                        size="default"
                    />
                </Form.Item>

                {/* 操作按钮 */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <motion.div {...hoverScale}>
                        <Button
                            onClick={onCancel}
                            size="large"
                            icon={<CloseOutlined />}
                        >
                            取消
                        </Button>
                    </motion.div>

                    <motion.div {...hoverScale}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            icon={<SaveOutlined />}
                        >
                            {category ? '更新分类' : '创建分类'}
                        </Button>
                    </motion.div>
                </div>
            </Form>
        </motion.div>
    );
};

export default CategoryForm; 