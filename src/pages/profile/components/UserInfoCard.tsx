import type { UserInfo } from '@/api/user';
import { Avatar } from '@/components/ui/Avatar';
import { hoverScale, itemVariants } from '@/constants';
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import React from 'react';

interface UserInfoCardProps {
  user: UserInfo;
  onEdit: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, onEdit }) => {
  const userFallback = user.nickname
    ? user.nickname.charAt(0).toUpperCase()
    : user.username.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">个人信息</h2>
        <motion.button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          {...hoverScale}
        >
          <EditOutlined />
          <span>编辑</span>
        </motion.button>
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <Avatar
          src={user.avatar}
          alt={user.nickname || user.username}
          size="xl"
          fallback={userFallback}
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {user.nickname || user.username}
          </h3>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-sm" />
              <span>{user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MailOutlined className="text-sm" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2">
                <PhoneOutlined className="text-sm" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.bio && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">个人简介</h4>
          <p className="text-gray-600 leading-relaxed">{user.bio}</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">角色：</span>
            <span className="ml-1">
              {user.role === 'user' ? '普通用户' : user.role}
            </span>
          </div>
          <div>
            <span className="font-medium">注册时间：</span>
            <span className="ml-1">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfoCard;
