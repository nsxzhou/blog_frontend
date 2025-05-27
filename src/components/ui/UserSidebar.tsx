import type { UserInfo } from '@/api/user';
import {
  backdropVariants,
  hoverScale,
  hoverScaleSmall,
  hoverSlideX,
  itemVariants,
  sidebarVariants,
} from '@/constants';
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  CloseOutlined,
  EditOutlined,
  FileImageOutlined,
  FileTextOutlined,
  HeartOutlined,
  LoginOutlined,
  LogoutOutlined,
  MessageOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from '@umijs/max';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Avatar } from './Avatar';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserInfo | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

const menuItems = [
  { key: '/profile', label: '个人中心', icon: <UserOutlined /> },
  { key: '/my-articles', label: '我的文章', icon: <FileTextOutlined /> },
  { key: '/write', label: '写文章', icon: <EditOutlined /> },
  { key: '/favorites', label: '收藏夹', icon: <HeartOutlined /> },
  { key: '/reading-list', label: '阅读列表', icon: <BookOutlined /> },
  { key: '/notifications', label: '通知', icon: <BellOutlined /> },
];

// 管理员专用菜单
const adminMenuItems = [
  { key: '/admin/articles', label: '文章管理', icon: <FileTextOutlined /> },
  { key: '/admin/users', label: '用户管理', icon: <TeamOutlined /> },
  { key: '/admin/images', label: '图片管理', icon: <FileImageOutlined /> },
  { key: '/admin/tags', label: '标签管理', icon: <TagOutlined /> },
  { key: '/admin/categories', label: '分类管理', icon: <AppstoreOutlined /> },
  { key: '/admin/comments', label: '评论管理', icon: <MessageOutlined /> },
];

export const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
}) => {
  const userFallback = user?.nickname
    ? user.nickname.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : '用';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* 侧边栏 */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">用户中心</h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                {...hoverScaleSmall}
              >
                <CloseOutlined className="text-lg" />
              </motion.button>
            </div>

            {/* 用户信息区域 */}
            <motion.div variants={itemVariants} className="p-6">
              {user ? (
                <div className="text-center">
                  <div className="mb-4">
                    <Avatar
                      src={user.avatar}
                      alt={user.nickname || user.username}
                      size="lg"
                      fallback={userFallback}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    {user.nickname || user.username}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">23</div>
                      <div className="text-gray-500">文章</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">156</div>
                      <div className="text-gray-500">粉丝</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">89</div>
                      <div className="text-gray-500">关注</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <UserOutlined className="text-2xl text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    欢迎回来
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    登录后查看更多内容
                  </p>
                  <motion.button
                    onClick={onLogin}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    {...hoverScale}
                  >
                    <LoginOutlined className="mr-2" />
                    立即登录
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* 菜单列表 */}
            {user && (
              <motion.div variants={itemVariants} className="px-3 pb-6">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link key={item.key} to={item.key} onClick={onClose}>
                      <motion.div
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-blue-50 transition-colors"
                        {...hoverSlideX}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  ))}

                  {/* 管理员菜单 */}
                  {user.role === 'admin' && (
                    <>
                      <div className="border-t border-gray-100 my-3" />
                      <div className="px-3 py-2">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          管理功能
                        </h4>
                      </div>
                      {adminMenuItems.map((item) => (
                        <Link key={item.key} to={item.key} onClick={onClose}>
                          <motion.div
                            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-blue-50 transition-colors"
                            {...hoverSlideX}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      ))}
                    </>
                  )}

                  {/* 分割线 */}
                  <div className="border-t border-gray-100 my-3" />

                  {/* 退出登录 */}
                  <motion.button
                    onClick={() => {
                      onLogout?.();
                      onClose();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    {...hoverSlideX}
                  >
                    <LogoutOutlined className="text-lg" />
                    <span className="font-medium">退出登录</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserSidebar;
