import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from '@umijs/max';
import {
  CloseOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { key: '/', label: '首页', icon: <HomeOutlined />, color: 'from-slate-600 to-slate-700' },
  { key: '/blog', label: '文章', icon: <FileTextOutlined />, color: 'from-blue-600 to-blue-700' },
  { key: '/about', label: '关于', icon: <UserOutlined />, color: 'from-green-600 to-green-700' },
  { key: '/write', label: '写作', icon: <EditOutlined />, color: 'from-purple-600 to-purple-700' },
];

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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={onClose}
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
                onClick={onClose}
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
  );
};

export default Sidebar; 