import { hoverScale } from '@/constants';
import {
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from '@umijs/max';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenu';
import { UserAvatar } from './UserAvatar';

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
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onLogin?.();
  };

  // 未登录状态
  if (!user) {
    return (
      <motion.button
        onClick={handleToggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        {...hoverScale}
      >
        <LoginOutlined className="text-lg" />
        <span className="hidden sm:block font-medium">登录</span>
      </motion.button>
    );
  }
  
  const trigger = (
    <div className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors">
      <UserAvatar
        size="sm"
        user={user}
      />
      <div className="hidden sm:block text-left">
        <div className="text-sm font-medium text-gray-800 truncate max-w-24">
          {user.name}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        {...hoverScale}
      >
        <UserAvatar
          size="sm"
          user={user}
        />
        <span className="hidden sm:block font-medium">
          {user.name || '用户'}
        </span>
      </motion.button>

      {/* 下拉菜单 */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-1 z-50">
          <DropdownMenu trigger={trigger} align="right">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
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
        </div>
      )}
    </div>
  );
};

export default UserMenu;
