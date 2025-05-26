import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Modal, Tabs, Avatar, message, Spin } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from '@umijs/max';
import { motion } from 'framer-motion';
import type { UpdateUserInfoReq, ChangePasswordReq } from '@/api/user';

const { TabPane } = Tabs;

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state: any) => state.user);
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 页面加载时获取用户信息
  useEffect(() => {
    if (!currentUser) {
      dispatch({ type: 'user/getCurrentUser' });
    }
  }, []);

  // 显示编辑信息弹窗
  const showEditModal = () => {
    if (currentUser) {
      editForm.setFieldsValue({
        nickname: currentUser.nickname,
        email: currentUser.email,
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
      });
    }
    setIsEditModalVisible(true);
  };

  // 处理编辑信息提交
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      const result = await dispatch({
        type: 'user/updateUserInfo',
        payload: values as UpdateUserInfoReq,
      }) as unknown as { success: boolean };
      
      if (result?.success) {
        setIsEditModalVisible(false);
        editForm.resetFields();
      }
    } catch (error) {
      console.error('编辑信息失败:', error);
    }
  };

  // 处理修改密码提交
  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      const result = await dispatch({
        type: 'user/changePassword',
        payload: values as ChangePasswordReq,
      }) as unknown as { success: boolean };
      
      if (result?.success) {
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      console.error('修改密码失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">获取用户信息失败</p>
          <Button type="primary" onClick={() => dispatch({ type: 'user/getCurrentUser' })}>
            重新获取
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div {...fadeInUp}>
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <Tabs defaultActiveKey="1" size="large">
              <TabPane tab="个人信息" key="1" icon={<UserOutlined />}>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* 用户头像和基本信息 */}
                    <div className="flex flex-col items-center md:items-start">
                      <Avatar
                        size={120}
                        src={currentUser.avatar}
                        icon={<UserOutlined />}
                        className="mb-4 shadow-lg"
                      />
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {currentUser.nickname}
                      </h2>
                      <p className="text-gray-500 mb-4">@{currentUser.username}</p>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={showEditModal}
                        className="rounded-full px-6"
                      >
                        编辑资料
                      </Button>
                    </div>

                    {/* 详细信息 */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            邮箱
                          </label>
                          <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                            {currentUser.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            手机号
                          </label>
                          <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                            {currentUser.phone || '未设置'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            角色
                          </label>
                          <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                            {currentUser.role}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            注册时间
                          </label>
                          <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
                            {new Date(currentUser.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {currentUser.bio && (
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            个人简介
                          </label>
                          <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                            {currentUser.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="安全设置" key="2" icon={<LockOutlined />}>
                <div className="p-6">
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      密码管理
                    </h3>
                    <p className="text-gray-600 mb-6">
                      定期更新密码可以保护您的账户安全
                    </p>
                    <Button
                      type="primary"
                      icon={<LockOutlined />}
                      onClick={() => setIsPasswordModalVisible(true)}
                      className="rounded-full px-6"
                    >
                      修改密码
                    </Button>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>

        {/* 编辑信息弹窗 */}
        <Modal
          title="编辑个人信息"
          open={isEditModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => {
            setIsEditModalVisible(false);
            editForm.resetFields();
          }}
          okText="保存"
          cancelText="取消"
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                { required: true, message: '请输入昵称' },
                { min: 2, max: 20, message: '昵称长度为2-20个字符' }
              ]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              label="个人简介"
              name="bio"
              rules={[
                { max: 200, message: '个人简介不能超过200个字符' }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="介绍一下自己吧..."
                showCount
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* 修改密码弹窗 */}
        <Modal
          title="修改密码"
          open={isPasswordModalVisible}
          onOk={handlePasswordSubmit}
          onCancel={() => {
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
          }}
          okText="确认修改"
          cancelText="取消"
          confirmLoading={loading}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              label="当前密码"
              name="old_password"
              rules={[
                { required: true, message: '请输入当前密码' }
              ]}
            >
              <Input.Password placeholder="请输入当前密码" />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="new_password"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度至少6位' }
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
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
            >
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage; 