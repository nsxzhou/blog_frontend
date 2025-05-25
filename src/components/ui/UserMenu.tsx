import React from 'react';
import { Link } from '@umijs/max';
import { motion } from 'framer-motion';
import {
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Avatar } from './Avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './DropdownMenu';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserMenuProps {
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogin,
  onLogout
}) => {
  // 未登录状态
  if (!user) {
    return (
      <motion.button
        onClick={onLogin}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LoginOutlined className="text-lg" />
        <span className="hidden sm:block font-medium">登录</span>
      </motion.button>
    );
  }

  // 已登录状态
  const userFallback = user.name ? user.name.charAt(0).toUpperCase() : '用';

  const trigger = (
    <div className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar
        src={user.avatar}
        alt={user.name}
        size="sm"
        fallback={userFallback}
      />
      <div className="hidden sm:block text-left">
        <div className="text-sm font-medium text-gray-800 truncate max-w-24">
          {user.name}
        </div>
      </div>
    </div>
  );

  return (
    <DropdownMenu trigger={trigger} align="right">
      <DropdownMenuLabel>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{user.name}</span>
          <span className="text-xs text-gray-500 truncate">{user.email}</span>
        </div>
      </DropdownMenuLabel>
      
      <DropdownMenuSeparator />
      
      <Link to="/profile">
        <DropdownMenuItem icon={<UserOutlined />}>
          个人资料
        </DropdownMenuItem>
      </Link>
      
      <Link to="/my-articles">
        <DropdownMenuItem icon={<FileTextOutlined />}>
          我的文章
        </DropdownMenuItem>
      </Link>
      
      <Link to="/settings">
        <DropdownMenuItem icon={<SettingOutlined />}>
          设置
        </DropdownMenuItem>
      </Link>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        icon={<LogoutOutlined />}
        onClick={onLogout}
        className="text-red-600 hover:bg-red-50"
      >
        退出登录
      </DropdownMenuItem>
    </DropdownMenu>
  );
};

export default UserMenu; 