import type { ChangePasswordReq } from '@/api/user';
import { hoverScale, itemVariants } from '@/constants';
import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface PasswordChangeFormProps {
  onSubmit: (data: ChangePasswordReq) => Promise<void>;
  loading?: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: ChangePasswordReq) => {
    try {
      await onSubmit(values);
      form.resetFields();
      message.success('密码修改成功');
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确');
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center mb-6">
        <LockOutlined className="text-xl text-gray-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">修改密码</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="max-w-md"
      >
        <Form.Item
          label="当前密码"
          name="old_password"
          rules={[{ required: true, message: '请输入当前密码' }]}
        >
          <Input.Password placeholder="请输入当前密码" size="large" />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="new_password"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度至少6位' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
              message: '密码必须包含字母和数字',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新密码" size="large" />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="confirm_password"
          dependencies={['new_password']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请再次输入新密码" size="large" />
        </Form.Item>

        <div className="pt-4">
          <motion.div {...hoverScale}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SaveOutlined />}
              className="w-full"
            >
              修改密码
            </Button>
          </motion.div>
        </div>
      </Form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          密码安全提示
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 密码长度至少6位</li>
          <li>• 必须包含字母和数字</li>
          <li>• 建议使用大小写字母、数字和特殊字符的组合</li>
          <li>• 定期更新密码以确保账户安全</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PasswordChangeForm;
