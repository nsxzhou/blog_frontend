import { GetImagesByType, type ImageInfo } from '@/api/image';
import type { UpdateUserInfoReq, UserInfo } from '@/api/user';
import { hoverScale, itemVariants } from '@/constants';
import {
  CloseOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Spin,
  message,
} from 'antd';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './UserEditForm.module.css';

interface UserEditFormProps {
  user: UserInfo;
  onSave: (data: UpdateUserInfoReq) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// 优化的头像项组件
const AvatarItem = React.memo<{
  image: ImageInfo;
  isSelected: boolean;
  onSelect: (imageUrl: string) => void;
}>(({ image, isSelected, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSelect = useCallback(() => {
    onSelect(image.url);
  }, [image.url, onSelect]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const itemClassName = useMemo(
    () => `avatar-item relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 group ${isSelected
      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`,
    [isSelected]
  );

  return (
    <motion.div
      className={itemClassName}
      onClick={handleSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="aspect-square relative overflow-hidden"
        style={{ lineHeight: 0 }}
      >
        {/* 图片加载占位符 */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <PictureOutlined className="text-xl text-gray-400" />
          </div>
        )}

        <img
          src={image.url}
          alt={image.filename}
          className={`w-full h-full object-cover transition-all duration-200 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            display: 'block',
            verticalAlign: 'top',
          }}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
        />
      </div>

      {/* 选中状态覆盖层 */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-sm font-medium">✓</span>
          </motion.div>
        </motion.div>
      )}

      {/* 悬停时的信息提示 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="text-white text-xs truncate">
          {image.filename}
        </div>
      </div>
    </motion.div>
  );
});

AvatarItem.displayName = 'AvatarItem';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const pageSize = 12;

  const handleFinish = useCallback(async (values: any) => {
    try {
      await onSave({
        ...values,
        avatar: selectedAvatar,
      });
      message.success('信息更新成功');
    } catch (error) {
      console.error('更新失败:', error);
    }
  }, [onSave, selectedAvatar]);

  // 获取头像图片列表
  const fetchAvatarImages = useCallback(async (page: number = 1) => {
    setAvatarLoading(true);
    try {
      const response = await GetImagesByType('avatar,cover', {
        page,
        page_size: pageSize,
        is_external: 1,
      });
      if (response.code === 0) {
        setAvatarImages(response.data.list);
        setTotalImages(response.data.total);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('获取图片列表失败:', error);
    } finally {
      setAvatarLoading(false);
    }
  }, [pageSize]);

  const handleOpenAvatarModal = useCallback(() => {
    setIsAvatarModalOpen(true);
    setCurrentPage(1);
    fetchAvatarImages(1);
  }, [fetchAvatarImages]);

  const handlePageChange = useCallback((page: number) => {
    fetchAvatarImages(page);
  }, [fetchAvatarImages]);

  const handleSelectAvatar = useCallback((imageUrl: string) => {
    setSelectedAvatar(imageUrl);
    form.setFieldsValue({ avatar: imageUrl });
    setIsAvatarModalOpen(false);
    message.success('头像选择成功');
  }, [form]);

  useEffect(() => {
    setSelectedAvatar(user.avatar);
  }, [user.avatar]);

  // 使用 useMemo 优化渲染的头像列表
  const renderedAvatars = useMemo(() => {
    return avatarImages.map((image) => (
      <AvatarItem
        key={image.id}
        image={image}
        isSelected={selectedAvatar === image.url}
        onSelect={handleSelectAvatar}
      />
    ));
  }, [avatarImages, selectedAvatar, handleSelectAvatar]);

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
          username: user.username,
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
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, max: 20, message: '用户名长度应在2-20个字符之间' },
              ]}
            >
              <Input placeholder="请输入用户名" size="large" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
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
        title={
          <div className="flex items-center space-x-2">
            <PictureOutlined className="text-blue-500" />
            <span>选择头像</span>
            {totalImages > 0 && (
              <span className="text-sm text-gray-500">
                (共 {totalImages} 张)
              </span>
            )}
          </div>
        }
        open={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 900 }}
        className={`avatar-select-modal ${styles.avatarSelectModal}`}
        styles={{
          body: { padding: '20px 24px' },
        }}
        destroyOnClose
      >
        <div className="space-y-6">
          {/* 当前选择的头像预览 */}
          {selectedAvatar && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">当前选择:</div>
                <Image
                  src={selectedAvatar}
                  alt="当前选择的头像"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-white shadow-md"
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                  preview={false}
                />
              </div>
            </motion.div>
          )}

          {/* 头像网格 */}
          <div className="min-h-[400px]">
            {avatarLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Spin size="large" />
                <div className="text-gray-500">加载头像中...</div>
              </div>
            ) : avatarImages.length > 0 ? (
              <motion.div
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${styles.avatarGrid}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderedAvatars}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="space-y-2">
                      <div className="text-gray-500">暂无可选择的头像图片</div>
                      <div className="text-sm text-gray-400">
                        请联系管理员添加头像图片
                      </div>
                    </div>
                  }
                />
              </motion.div>
            )}
          </div>

          {/* 分页器 */}
          {totalImages > pageSize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center pt-4 border-t border-gray-100"
            >
              <Pagination
                current={currentPage}
                total={totalImages}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total: number, range: [number, number]) =>
                  `第 ${range[0]}-${range[1]} 项，共 ${total} 项`
                }
                className={`custom-pagination ${styles.customPagination}`}
              />
            </motion.div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default UserEditForm;
