import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Outlet, useLocation, Link } from '@umijs/max';
import {
  MenuOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  CloseOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';

// 简化的动画变体
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

const sidebarVariants = {
  closed: { 
    x: -280,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 40 
    }
  },
  open: { 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 40,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const sidebarItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// 导航菜单项
const navigationItems = [
  { key: '/', label: '首页', icon: <HomeOutlined />, color: 'from-slate-600 to-slate-700' },
  { key: '/blog', label: '文章', icon: <FileTextOutlined />, color: 'from-blue-600 to-blue-700' },
  { key: '/about', label: '关于', icon: <UserOutlined />, color: 'from-green-600 to-green-700' },
  { key: '/write', label: '写作', icon: <EditOutlined />, color: 'from-purple-600 to-purple-700' },
];

// 简化的按钮组件
const SimpleButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'default' | 'ghost';
}> = ({ children, onClick, className = "", variant = 'default' }) => {
  const baseClasses = "transition-all duration-200 ease-out";
  const variantClasses = {
    default: "bg-white/80 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-white/50 text-gray-600 hover:text-gray-800"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
};

const GlobalLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // 简化的滚动效果
  const headerOpacity = useTransform(scrollY, [0, 80], [0.95, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 80], [12, 20]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeAll = () => {
    setSidebarOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* 简化的背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* 简洁的顶部导航栏 */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50"
      >
        <div className="flex items-center justify-between h-16 px-6 lg:px-8">
          {/* 左侧：Logo和菜单 */}
          <div className="flex items-center space-x-4">
            <SimpleButton
              onClick={toggleSidebar}
              className="p-2 rounded-lg"
              variant="ghost"
            >
              <MenuOutlined className="text-lg" />
            </SimpleButton>
            
            <Link to="/">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">思</span>
                </div>
                <span className="font-semibold text-xl text-gray-800 hidden sm:block">
                  思维笔记
                </span>
              </motion.div>
            </Link>
          </div>

          {/* 中间：导航菜单 */}
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

          {/* 右侧：搜索和社交 */}
          <div className="flex items-center space-x-2">
            <SimpleButton
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg"
              variant="ghost"
            >
              <SearchOutlined className="text-lg" />
            </SimpleButton>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { icon: <GithubOutlined />, href: '#' },
                { icon: <TwitterOutlined />, href: '#' },
                { icon: <LinkedinOutlined />, href: '#' },
              ].map((social, index) => (
                <SimpleButton
                  key={index}
                  className="p-2 rounded-lg"
                  variant="ghost"
                >
                  {social.icon}
                </SimpleButton>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索框展开 */}
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
      </motion.header>

      {/* 简化的侧边栏 */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 lg:hidden"
              onClick={toggleSidebar}
            />
            
            {/* 侧边栏内容 */}
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-xl"
            >
              {/* 侧边栏头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <motion.div
                  variants={sidebarItemVariants}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">思</span>
                  </div>
                  <span className="font-semibold text-xl text-gray-800">思维笔记</span>
                </motion.div>
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CloseOutlined />
                </motion.button>
              </div>

              {/* 导航菜单 */}
              <nav className="p-6 space-y-1">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    variants={sidebarItemVariants}
                    custom={index}
                  >
                    <Link
                      to={item.key}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        location.pathname === item.key
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* 侧边栏底部 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                <motion.div
                  variants={sidebarItemVariants}
                  className="text-center"
                >
                  <p className="text-sm text-gray-500 mb-4">关注我们</p>
                  <div className="flex justify-center space-x-3">
                    {[
                      { icon: <GithubOutlined />, color: 'hover:text-gray-700' },
                      { icon: <TwitterOutlined />, color: 'hover:text-blue-500' },
                      { icon: <LinkedinOutlined />, color: 'hover:text-blue-600' },
                    ].map((social, index) => (
                      <motion.button
                        key={index}
                        className={`p-2 rounded-lg text-gray-400 transition-colors duration-200 ${social.color}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {social.icon}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <main className="pt-16 min-h-screen relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="container mx-auto px-4 py-6 lg:px-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default GlobalLayout; 