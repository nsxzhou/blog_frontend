import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation, history } from '@umijs/max';
import {
  MenuOutlined,
  SearchOutlined,
  CloseOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Input, message } from 'antd';
import { Button, UserSidebar } from '@/components/ui';

interface HeaderProps {
  onMenuToggle: () => void;
}

const navigationItems = [
  { key: '/', label: '首页', icon: <HomeOutlined /> },
  { key: '/blog', label: '文章', icon: <FileTextOutlined /> },
  { key: '/about', label: '关于', icon: <UserOutlined /> },
  { key: '/write', label: '写作', icon: <EditOutlined /> },
];

const headerVariants = {
  hidden: { y: -60, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    }
  }
};

const navItemVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  tap: { scale: 0.98 }
};

const Header: React.FC<HeaderProps> = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // 模拟用户状态，实际项目中应该从全局状态管理中获取
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  
  const headerBlur = useTransform(scrollY, [0, 80], [12, 20]);

  // 处理登录
  const handleLogin = () => {
    // 这里应该跳转到登录页面或打开登录模态框
    history.push('/login');
    message.info('跳转到登录页面');
  };

  // 处理登出
  const handleLogout = () => {
    setUser(null);
    message.success('已退出登录');
  };

  const toggleLoginState = () => {
    if (user) {
      handleLogout();
    } else {
      setUser({
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/123456789?v=4'
      });
      message.success('登录成功');
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
          {/* <Button
            onClick={onMenuToggle}
            className="p-2 rounded-lg"
            variant="ghost"
          >
            <MenuOutlined className="text-lg" />
          </Button> */}
          
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
                { icon: <GithubOutlined />, href: '#' },
                { icon: <TwitterOutlined />, href: '#' },
                { icon: <LinkedinOutlined />, href: '#' },
              ].map((social, index) => (
                <Button
                  key={index}
                  className="p-2 rounded-lg"
                  variant="ghost"
                >
                  {social.icon}
                </Button>
              ))}
            </div>
            
            {/* 临时演示按钮 - 实际项目中可以移除 */}
            <Button
              onClick={toggleLoginState}
              className="px-3 py-1 text-xs"
              variant="secondary"
            >
              {user ? '演示登出' : '演示登录'}
            </Button>
            
            {/* 用户头像触发器 */}
            <Button
              onClick={() => setUserSidebarOpen(true)}
              className="p-1 rounded-lg"
              variant="ghost"
            >
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-800">
                    {user.name}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-gray-200/50 bg-white/90 backdrop-blur-sm"
          >
            <div className="px-6 py-4">
              <div className="relative max-w-md mx-auto">
                <Input
                  placeholder="搜索文章、标签、作者..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  suffix={
                    <motion.button
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CloseOutlined />
                    </motion.button>
                  }
                  className="rounded-lg border-gray-200"
                  size="large"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 用户侧边栏 */}
      <UserSidebar
        isOpen={userSidebarOpen}
        onClose={() => setUserSidebarOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </motion.header>
  );
};

export default Header; 