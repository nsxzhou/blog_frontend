import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Input, Button, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CreateTag, UpdateTag, type TagInfo, type CreateTagReq } from '@/api/tag';
import { fadeInUp, hoverScale } from '@/constants/animations';

interface TagFormProps {
    tag?: TagInfo | null;
    onSuccess: () => void;
    onCancel: () => void;
}

interface FormValues {
    name: string;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSuccess, onCancel }) => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    // 初始化表单数据
    useEffect(() => {
        if (tag) {
            form.setFieldsValue({
                name: tag.name,
            });
        } else {
            form.resetFields();
        }
    }, [tag, form]);

    // 处理表单提交
    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const requestData: CreateTagReq = {
                name: values.name.trim(),
            };

            if (tag) {
                // 编辑标签
                const response = await UpdateTag(tag.id, requestData);
                if (response.code === 0) {
                    message.success('标签更新成功');
                    onSuccess();
                }
            } else {
                // 创建标签
                const response = await CreateTag(requestData);
                if (response.code === 0) {
                    message.success('标签创建成功');
                    onSuccess();
                }
            }
        } catch (error) {
            message.error(tag ? '更新标签失败' : '创建标签失败');
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
                {/* 标签名称 */}
                <Form.Item
                    name="name"
                    label="标签名称"
                    rules={[
                        { required: true, message: '请输入标签名称' },
                        { min: 1, max: 30, message: '标签名称长度应在1-30个字符之间' },
                        {
                            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
                            message: '标签名称只能包含中英文、数字、下划线和短横线'
                        }
                    ]}
                >
                    <Input
                        placeholder="请输入标签名称"
                        size="large"
                        maxLength={30}
                        showCount
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
                            {tag ? '更新标签' : '创建标签'}
                        </Button>
                    </motion.div>
                </div>
            </Form>
        </motion.div>
    );
};

export default TagForm;