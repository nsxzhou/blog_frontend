import type { UpdateUserInfoReq, UserInfo } from '@/api/user';
import { hoverScale, itemVariants } from '@/constants';
import { CloseOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface UserEditFormProps {
  user: UserInfo;
  onSave: (data: UpdateUserInfoReq) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleFinish = async (values: any) => {
    try {
      await onSave(values);
      message.success('信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setAvatarLoading(false);
      // 这里应该处理上传成功后的逻辑
      const imageUrl = info.file.response?.url || info.file.response?.data?.url;
      if (imageUrl) {
        form.setFieldsValue({ avatar: imageUrl });
        message.success('头像上传成功');
      }
    }
    if (info.file.status === 'error') {
      setAvatarLoading(false);
      message.error('头像上传失败');
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>
        {avatarLoading ? '上传中...' : '选择文件'}
      </div>
    </div>
  );

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">编辑个人信息</h2>
        <motion.button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CloseOutlined />
        </motion.button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          nickname: user.nickname,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          avatar: user.avatar,
        }}
        onFinish={handleFinish}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                { required: true, message: '请输入昵称' },
                { min: 2, max: 20, message: '昵称长度应在2-20个字符之间' },
              ]}
            >
              <Input placeholder="请输入昵称" size="large" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱地址" size="large" />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
              ]}
            >
              <Input placeholder="请输入手机号码" size="large" />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item label="头像" name="avatar">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/upload/avatar"
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('只能上传 JPG/PNG 格式的图片!');
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error('图片大小不能超过 2MB!');
                  }
                  return isJpgOrPng && isLt2M;
                }}
                onChange={handleAvatarUpload}
              >
                {form.getFieldValue('avatar') ? (
                  <img
                    src={form.getFieldValue('avatar')}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label="个人简介"
          name="bio"
          rules={[{ max: 200, message: '个人简介不能超过200个字符' }]}
        >
          <Input.TextArea
            placeholder="写一段简介介绍一下自己吧..."
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <Button size="large" onClick={onCancel} className="px-6">
            取消
          </Button>
          <motion.div {...hoverScale}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SaveOutlined />}
              className="px-6"
            >
              保存更改
            </Button>
          </motion.div>
        </div>
      </Form>
    </motion.div>
  );
};

export default UserEditForm;
