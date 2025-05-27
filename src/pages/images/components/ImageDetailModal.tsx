import { UpdateImage } from '@/api/image';
import { hoverScale, modalVariants } from '@/constants/animations';
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
} from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import type { ImageDetailModalProps } from './types';
import { STORAGE_TYPES, USAGE_TYPES } from './types';

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  image,
  visible,
  onCancel,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  if (!image) return null;

  // 复制链接
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      message.success('图片链接已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  // 下载图片
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('开始下载图片');
  };

  // 开始编辑
  const startEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      usage_type: image.usage_type,
      article_id: image.article_id,
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  // 保存编辑
  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await UpdateImage(image.id, values);

      message.success('图片信息更新成功');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 删除图片
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这张图片吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => onDelete(image.id),
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span>图片详情</span>
          <div className="flex items-center space-x-2">
            <motion.div variants={hoverScale}>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyUrl}
                size="small"
              >
                复制链接
              </Button>
            </motion.div>
            <motion.div variants={hoverScale}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                size="small"
              >
                下载
              </Button>
            </motion.div>
            {!isEditing ? (
              <motion.div variants={hoverScale}>
                <Button
                  icon={<EditOutlined />}
                  onClick={startEdit}
                  size="small"
                >
                  编辑
                </Button>
              </motion.div>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={cancelEdit} size="small">
                  取消
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={saveEdit}
                  loading={loading}
                  size="small"
                >
                  保存
                </Button>
              </div>
            )}
            <motion.div variants={hoverScale}>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                size="small"
              >
                删除
              </Button>
            </motion.div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="image-detail-modal"
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* 图片预览 */}
        <div className="flex justify-center">
          <Image
            src={image.url}
            alt={image.original_name}
            className="max-w-full max-h-96 object-contain rounded-lg"
            preview={{
              mask: '点击预览',
            }}
          />
        </div>

        {/* 图片信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              基本信息
            </h3>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="文件名">
                {image.original_name}
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">
                {formatFileSize(image.size)}
              </Descriptions.Item>
              <Descriptions.Item label="文件类型">
                {image.mime_type}
              </Descriptions.Item>
              <Descriptions.Item label="存储类型">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  {STORAGE_TYPES.find(
                    (type) => type.value === image.storage_type,
                  )?.label || image.storage_type}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="上传时间">
                {formatDate(image.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {formatDate(image.updated_at)}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* 使用信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              使用信息
            </h3>
            {isEditing ? (
              <Form form={form} layout="vertical">
                <Form.Item
                  label="使用类型"
                  name="usage_type"
                  rules={[{ required: true, message: '请选择使用类型' }]}
                >
                  <Select>
                    {USAGE_TYPES.filter((type) => type.value !== 'all').map(
                      (type) => (
                        <Select.Option key={type.value} value={type.value}>
                          {type.label}
                        </Select.Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
                <Form.Item label="关联文章ID" name="article_id">
                  <Input type="number" placeholder="可选，关联的文章ID" />
                </Form.Item>
              </Form>
            ) : (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="使用类型">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {USAGE_TYPES.find((type) => type.value === image.usage_type)
                      ?.label || image.usage_type}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="关联文章">
                  {image.article_id ? (
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      文章 #{image.article_id}
                    </span>
                  ) : (
                    <span className="text-gray-500">无关联文章</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="是否外部链接">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      image.is_external
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {image.is_external ? '外部链接' : '本地存储'}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </div>

        {/* 图片链接 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">图片链接</h3>
          <div className="flex items-center space-x-2">
            <Input value={image.url} readOnly className="flex-1" />
            <Button icon={<CopyOutlined />} onClick={handleCopyUrl}>
              复制
            </Button>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ImageDetailModal;
