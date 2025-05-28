import { UpdateImage } from '@/api/image';
import { hoverScale, modalVariants } from '@/constants/animations';
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import type { ImageDetailModalProps } from './types';
import { STORAGE_TYPES, USAGE_TYPES } from './types';

const { Title, Text } = Typography;

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
    link.download = image.filename;
    link.target = '_blank';
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
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      className="image-detail-modal"
      styles={{
        body: { padding: 0 },
      }}
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        className="relative"
      >
        {/* 头部操作栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <EditOutlined className="text-blue-600 text-lg" />
            </div>
            <div>
              <Title level={4} className="!mb-0">
                图片详情
              </Title>
              <Text type="secondary" className="text-sm">
                {image.filename}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div {...hoverScale}>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyUrl}
                type="text"
                className="flex items-center gap-1"
              >
                复制链接
              </Button>
            </motion.div>
            <motion.div {...hoverScale}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                type="text"
                className="flex items-center gap-1"
              >
                下载
              </Button>
            </motion.div>
            {!isEditing ? (
              <motion.div {...hoverScale}>
                <Button
                  icon={<EditOutlined />}
                  onClick={startEdit}
                  type="primary"
                  ghost
                  className="flex items-center gap-1"
                >
                  编辑
                </Button>
              </motion.div>
            ) : (
              <Space>
                <Button onClick={cancelEdit}>取消</Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={saveEdit}
                  loading={loading}
                  className="flex items-center gap-1"
                >
                  保存
                </Button>
              </Space>
            )}
            <motion.div {...hoverScale}>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                type="text"
                className="flex items-center gap-1"
              >
                删除
              </Button>
            </motion.div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[70vh]">
          {/* 左侧：图片预览 */}
          <div className="bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-full max-h-full">
              <Image
                src={image.url}
                alt={image.filename}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                preview={{
                  mask: (
                    <div className="text-white text-center">
                      <EyeOutlined className="text-2xl mb-2" />
                      <div>点击预览</div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="p-6 overflow-y-auto">
            <Space direction="vertical" size="large" className="w-full">
              {/* 基本信息卡片 */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    基本信息
                  </div>
                }
                size="small"
                className="shadow-sm"
              >
                <Descriptions column={1} size="small" colon={false}>
                  <Descriptions.Item
                    label={<Text strong>文件名</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text copyable={{ text: image.filename }}>
                      {image.filename}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Text strong>文件大小</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text>{formatFileSize(image.size)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Text strong>尺寸</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text>
                      {image.width} × {image.height} px
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Text strong>文件类型</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text code>{image.mime_type}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Text strong>存储类型</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {STORAGE_TYPES.find(
                        (type) => type.value === image.storage_type,
                      )?.label || image.storage_type}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 使用信息卡片 */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    使用信息
                  </div>
                }
                size="small"
                className="shadow-sm"
              >
                {isEditing ? (
                  <Form form={form} layout="vertical" className="space-y-4">
                    <Form.Item
                      label="使用类型"
                      name="usage_type"
                      rules={[{ required: true, message: '请选择使用类型' }]}
                    >
                      <Select placeholder="请选择使用类型">
                        {USAGE_TYPES.map((type) => (
                          <Select.Option key={type.value} value={type.value}>
                            {type.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="关联文章ID" name="article_id">
                      <Input type="number" placeholder="可选，关联的文章ID" />
                    </Form.Item>
                  </Form>
                ) : (
                  <Descriptions column={1} size="small" colon={false}>
                    <Descriptions.Item
                      label={<Text strong>使用类型</Text>}
                      labelStyle={{ width: '80px' }}
                    >
                      <Text className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {USAGE_TYPES.find(
                          (type) => type.value === image.usage_type,
                        )?.label || image.usage_type}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<Text strong>关联文章</Text>}
                      labelStyle={{ width: '80px' }}
                    >
                      {image.article_id ? (
                        <Text className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          文章 #{image.article_id}
                        </Text>
                      ) : (
                        <Text type="secondary">无关联文章</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<Text strong>外部链接</Text>}
                      labelStyle={{ width: '80px' }}
                    >
                      <Text
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          image.is_external
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {image.is_external ? '是' : '否'}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Card>

              {/* 时间信息卡片 */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    时间信息
                  </div>
                }
                size="small"
                className="shadow-sm"
              >
                <Descriptions column={1} size="small" colon={false}>
                  <Descriptions.Item
                    label={<Text strong>上传时间</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text>{formatDate(image.created_at)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<Text strong>更新时间</Text>}
                    labelStyle={{ width: '80px' }}
                  >
                    <Text>{formatDate(image.updated_at)}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 图片链接卡片 */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    图片链接
                  </div>
                }
                size="small"
                className="shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={image.url}
                    readOnly
                    className="flex-1 font-mono text-sm"
                    size="small"
                  />
                  <motion.div {...hoverScale}>
                    <Button
                      icon={<CopyOutlined />}
                      onClick={handleCopyUrl}
                      size="small"
                      type="primary"
                      ghost
                    >
                      复制
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </Space>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ImageDetailModal;
