import { UploadImage } from '@/api/image';
import { itemVariants, modalVariants } from '@/constants/animations';
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Progress, Select, Upload } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import type { ImageUploadModalProps, UploadProgress } from './types';
import { STORAGE_TYPES, USAGE_TYPES } from './types';

const { Dragger } = Upload;

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [uploadList, setUploadList] = useState<UploadProgress[]>([]);
  const [usageType, setUsageType] = useState('content');
  const [storageType, setStorageType] = useState('local');
  const [uploading, setUploading] = useState(false);

  // 重置状态
  const resetState = useCallback(() => {
    setUploadList([]);
    setUsageType('content');
    setStorageType('local');
    setUploading(false);
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback(
    (fileList: File[]) => {
      const newUploads: UploadProgress[] = fileList.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: 'uploading',
      }));

      setUploadList((prev) => [...prev, ...newUploads]);

      // 开始上传
      newUploads.forEach((upload) => {
        uploadSingleFile(upload);
      });
    },
    [usageType, storageType],
  );

  // 上传单个文件
  const uploadSingleFile = async (uploadItem: UploadProgress) => {
    try {
      setUploading(true);

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setUploadList((prev) =>
          prev.map((item) =>
            item.id === uploadItem.id
              ? { ...item, progress: Math.min(item.progress + 10, 90) }
              : item,
          ),
        );
      }, 200);

      const response = await UploadImage({
        image: uploadItem.file,
        usage_type: usageType,
        storage_type: storageType,
      });

      clearInterval(progressInterval);

      if (response.code === 0) {
        setUploadList((prev) =>
          prev.map((item) =>
            item.id === uploadItem.id
              ? {
                  ...item,
                  progress: 100,
                  status: 'success',
                  url: response.data.url,
                }
              : item,
          ),
        );
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      setUploadList((prev) =>
        prev.map((item) =>
          item.id === uploadItem.id
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : '上传失败',
              }
            : item,
        ),
      );
    } finally {
      setUploading(false);
    }
  };

  // 删除上传项
  const removeUploadItem = (id: string) => {
    setUploadList((prev) => prev.filter((item) => item.id !== id));
  };

  // 重试上传
  const retryUpload = (uploadItem: UploadProgress) => {
    setUploadList((prev) =>
      prev.map((item) =>
        item.id === uploadItem.id
          ? { ...item, status: 'uploading', progress: 0, error: undefined }
          : item,
      ),
    );
    uploadSingleFile(uploadItem);
  };

  // 处理弹窗关闭
  const handleCancel = () => {
    if (uploading) {
      message.warning('正在上传中，请稍候...');
      return;
    }
    resetState();
    onCancel();
  };

  // 处理完成
  const handleFinish = () => {
    const hasSuccess = uploadList.some((item) => item.status === 'success');
    if (hasSuccess) {
      onSuccess();
      resetState();
    } else {
      onCancel();
    }
  };

  // 自定义上传
  const customRequest = ({ file, onProgress, onSuccess, onError }: any) => {
    // 阻止默认上传，我们手动处理
    return {
      abort() {
        console.log('upload aborted.');
      },
    };
  };

  const allCompleted =
    uploadList.length > 0 &&
    uploadList.every(
      (item) => item.status === 'success' || item.status === 'error',
    );

  return (
    <Modal
      title="上传图片"
      open={visible}
      onCancel={handleCancel}
      footer={
        uploadList.length > 0 ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {uploadList.filter((item) => item.status === 'success').length} /{' '}
              {uploadList.length} 上传成功
            </span>
            <div className="space-x-2">
              <Button onClick={handleCancel}>
                {allCompleted ? '关闭' : '取消'}
              </Button>
              {allCompleted && (
                <Button type="primary" onClick={handleFinish}>
                  完成
                </Button>
              )}
            </div>
          </div>
        ) : null
      }
      width={600}
      className="upload-modal"
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* 配置选项 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              使用类型
            </label>
            <Select
              value={usageType}
              onChange={setUsageType}
              className="w-full"
              disabled={uploading}
            >
              {USAGE_TYPES.filter((type) => type.value !== 'all').map(
                (type) => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ),
              )}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              存储类型
            </label>
            <Select
              value={storageType}
              onChange={setStorageType}
              className="w-full"
              disabled={uploading}
            >
              {STORAGE_TYPES.filter((type) => type.value !== 'all').map(
                (type) => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ),
              )}
            </Select>
          </div>
        </div>

        {/* 上传区域 */}
        {uploadList.length === 0 && (
          <Dragger
            multiple
            accept="image/*"
            customRequest={customRequest}
            beforeUpload={(file) => {
              handleFileSelect([file]);
              return false;
            }}
            showUploadList={false}
            className="upload-dragger"
          >
            <motion.div variants={itemVariants} className="py-8">
              <CloudUploadOutlined className="text-4xl text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                点击或拖拽文件到此区域上传
              </p>
              <p className="text-gray-500">
                支持 JPG、PNG、GIF、WebP 格式，单个文件最大 10MB
              </p>
            </motion.div>
          </Dragger>
        )}

        {/* 上传列表 */}
        <AnimatePresence>
          {uploadList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {uploadList.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>
                    <div className="mt-1">
                      {item.status === 'uploading' && (
                        <Progress
                          percent={item.progress}
                          size="small"
                          status="active"
                        />
                      )}
                      {item.status === 'success' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircleOutlined className="mr-1" />
                          <span className="text-sm">上传成功</span>
                        </div>
                      )}
                      {item.status === 'error' && (
                        <div className="flex items-center text-red-600">
                          <ExclamationCircleOutlined className="mr-1" />
                          <span className="text-sm">{item.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2">
                    {item.status === 'error' && (
                      <Button size="small" onClick={() => retryUpload(item)}>
                        重试
                      </Button>
                    )}
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeUploadItem(item.id)}
                      disabled={item.status === 'uploading'}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  );
};

export default ImageUploadModal;
