import { Button, QRCodeModal, UserAvatar } from '@/components/ui';
import {
  fadeInUp,
  headerVariants,
  navItemVariants,
} from '@/constants/animations';
import useUserModel from '@/models/user';
import {
  CloseOutlined,
  EditOutlined,
  FileTextOutlined,
  GithubOutlined,
  QqOutlined,
  SearchOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from '@umijs/max';
import { Input } from 'antd';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { useState } from 'react';
import UserSidebar from '../../components/ui/UserSidebar';

interface HeaderProps {
  onMenuToggle: () => void;
}

const navigationItems = [
  { key: '/', label: '首页', icon: <FileTextOutlined /> },
  { key: '/blog', label: '文章', icon: <FileTextOutlined /> },
  { key: '/about', label: '关于', icon: <UserOutlined /> },
  { key: '/write', label: '写作', icon: <EditOutlined /> },
];

const Header: React.FC<HeaderProps> = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrType, setQrType] = useState<'wechat' | 'qq' | null>(null);
  const location = useLocation();
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  // 获取当前用户信息和logout方法
  const { currentUser, logout } = useUserModel();

  const headerBlur = useTransform(scrollY, [0, 80], [12, 20]);

  // 处理登录
  const handleLogin = () => {
    navigate('/login');
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      // 跳转到首页
      navigate('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 处理社交媒体点击
  const handleSocialClick = (type: 'github' | 'wechat' | 'qq') => {
    switch (type) {
      case 'github':
        window.open('https://github.com/nsxzhou', '_blank');
        break;
      case 'wechat':
        setQrType('wechat');
        setQrModalOpen(true);
        break;
      case 'qq':
        setQrType('qq');
        setQrModalOpen(true);
        break;
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        backdropFilter: `blur(${headerBlur}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50"
    >
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-semibold text-xl text-gray-800 hidden sm:block">
                思维笔记
              </span>
            </motion.div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.key} to={item.key}>
              <motion.div
                variants={navItemVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`relative px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.key
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg"
            variant="ghost"
          >
            <SearchOutlined className="text-lg" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1">
              {[
                {
                  icon: <GithubOutlined />,
                  type: 'github' as const,
                },
                {
                  icon: <WechatOutlined />,
                  type: 'wechat' as const,
                },
                {
                  icon: <QqOutlined />,
                  type: 'qq' as const,
                },
              ].map((social, index) => (
                <Button
                  key={index}
                  className="p-2 rounded-lg"
                  variant="ghost"
                  onClick={() => handleSocialClick(social.type)}
                >
                  {social.icon}
                </Button>
              ))}
            </div>

            {/* 用户头像触发器 */}
            <Button
              onClick={() => setUserSidebarOpen(true)}
              className="p-1 rounded-lg"
              variant="ghost"
            >
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={currentUser} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-gray-800">
                    {currentUser.nickname || currentUser.username}
                  </span>
                </div>
              ) : (
                <UserOutlined className="text-lg" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            {...fadeInUp}
            className="border-t border-gray-200/50 bg-white/90 backdrop-blur-sm"
          >
            <div className="px-6 py-4">
              <div className="relative max-w-md mx-auto">
                <Input
                  placeholder="搜索文章、标签、作者..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  suffix={
                    <Button
                      onClick={() => setSearchOpen(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <CloseOutlined />
                    </Button>
                  }
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 二维码模态框 */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setQrType(null);
        }}
        type={qrType}
      />

      {/* 用户侧边栏 */}
      <UserSidebar
        isOpen={userSidebarOpen}
        onClose={() => setUserSidebarOpen(false)}
        user={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </motion.header>
  );
};

export default Header;
