import { motion } from 'framer-motion';
import React from 'react';

interface UserInfo {
  avatar?: string;
  nickname?: string;
  username?: string;
  name?: string;
}

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
  user?: UserInfo;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const getDisplayName = (user?: UserInfo): string => {
  if (!user) return '';
  return user.nickname || user.username || user.name || '';
};

const getAvatarUrl = (user?: UserInfo): string | undefined => {
  if (!user) return undefined;
  return user.avatar;
};

const generateFallback = (user?: UserInfo, customFallback?: string): string => {
  if (customFallback) return customFallback;

  const displayName = getDisplayName(user);
  if (displayName) {
    return displayName.charAt(0).toUpperCase();
  }

  return '用';
};

export const UserAvatar: React.FC<AvatarProps> = ({
  src,
  alt = '用户头像',
  size = 'md',
  className = '',
  fallback,
  user,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarSrc = src || getAvatarUrl(user);

  const fallbackText = generateFallback(user, fallback);

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-medium  ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {avatarSrc && !imageError ? (
        <img
          src={avatarSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="select-none text-black">{fallbackText}</span>
      )}
    </motion.div>
  );
};

export default UserAvatar;
