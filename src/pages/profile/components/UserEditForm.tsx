import { GetImagesByType, type ImageInfo } from '@/api/image';
import type { UpdateUserInfoReq, UserInfo } from '@/api/user';
import { hoverScale, itemVariants } from '@/constants';
import {
  CloseOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Empty, Form, Image, Input, Modal, Spin, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarImages, setAvatarImages] = useState<ImageInfo[]>([]);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const handleFinish = async (values: any) => {
    try {
      await onSave({
        ...values,
        avatar: selectedAvatar,
      });
      message.success('信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  // 获取头像图片列表
  const fetchAvatarImages = async () => {
    setAvatarLoading(true);
    try {
      const response = await GetImagesByType('avatar', {
        page: 1,
        page_size: 50,
      });
      if (response.code === 200) {
        setAvatarImages(response.data.list);
      }
    } catch (error) {
      message.error('获取图片列表失败');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
    fetchAvatarImages();
  };

  const handleSelectAvatar = (imageUrl: string) => {
    setSelectedAvatar(imageUrl);
    form.setFieldsValue({ avatar: imageUrl });
    setIsAvatarModalOpen(false);
    message.success('头像选择成功');
  };

  useEffect(() => {
    setSelectedAvatar(user.avatar);
  }, [user.avatar]);

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
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {selectedAvatar ? (
                    <Image
                      src={selectedAvatar}
                      alt="当前头像"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-2 border-gray-200"
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <PictureOutlined className="text-3xl text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  type="primary"
                  icon={<PictureOutlined />}
                  onClick={handleOpenAvatarModal}
                  className="px-6"
                >
                  选择头像
                </Button>
              </div>
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

      {/* 头像选择模态框 */}
      <Modal
        title="选择头像"
        open={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        footer={null}
        width={800}
        className="avatar-select-modal"
      >
        <div className="py-4">
          {avatarLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : avatarImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {avatarImages.map((image) => (
                <motion.div
                  key={image.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedAvatar === image.url
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAvatar(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={image.filename}
                    width="100%"
                    height={120}
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                    preview={false}
                  />
                  {selectedAvatar === image.url && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <Empty description="暂无可选择的头像图片" className="py-8" />
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default UserEditForm;
