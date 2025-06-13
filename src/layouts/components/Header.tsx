import { Logout } from '@/api/user';
import {
  Button,
  QRCodeModal,
  SearchResults,
  UserAvatar,
} from '@/components/ui';
import {
  cardHover,
  fadeInUp,
  headerVariants,
  navItemVariants,
} from '@/constants/animations';
import { useSearch } from '@/hooks/useSearch';
import { UserModelState } from '@/models/user';
import { getRefreshTokenFromStorage, getTokenFromStorage } from '@/utils/auth';
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
import {
  connect,
  Link,
  useDispatch,
  useLocation,
  useNavigate,
} from '@umijs/max';
import { Input, message } from 'antd';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import UserSidebar from '../../components/ui/UserSidebar';

interface HeaderProps {
  onMenuToggle?: () => void;
  user: UserModelState;
}

const navigationItems = [
  { key: '/', label: '首页', icon: <FileTextOutlined /> },
  { key: '/blog', label: '文章', icon: <FileTextOutlined /> },
  { key: '/about', label: '关于', icon: <UserOutlined /> },
  // { key: '/rss', label: 'RSS', icon: <Rss size={16} /> },
  { key: '/write', label: '写作', icon: <EditOutlined /> },
];

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrType, setQrType] = useState<'wechat' | 'qq' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 搜索相关
  const { keyword, results, loading, handleSearch, clearSearch } = useSearch();

  const headerBlur = useTransform(scrollY, [0, 80], [12, 20]);

  // 处理搜索输入变化
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchValue);
    }, 300); // 防抖

    return () => clearTimeout(timer);
  }, [searchValue, handleSearch]);

  // 点击外部关闭搜索
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        handleCloseSearch();
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  // ESC键关闭搜索
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchOpen) {
        handleCloseSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  // 处理登录
  const handleLogin = () => {
    navigate('/login');
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      const res = await Logout({
        access_token: getTokenFromStorage() || '',
        refresh_token: getRefreshTokenFromStorage() || '',
      });
      if (res.code === 0) {
        dispatch({ type: 'user/clearUser' });
        // 跳转到首页
        message.success('登出成功');
        navigate('/');
      }
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

  // 关闭搜索
  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchValue('');
    clearSearch();
  };

  // 搜索结果点击
  const handleSearchResultClick = () => {
    handleCloseSearch();
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
              {user.currentUser ? (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={user.currentUser} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-gray-800">
                    {user.currentUser.nickname || user.currentUser.username}
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
              <div ref={searchRef} className="relative max-w-4xl mx-auto">
                <Input
                  placeholder="搜索文章、标签、作者..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  suffix={
                    <Button
                      onClick={handleCloseSearch}
                      variant="ghost"
                      size="sm"
                    >
                      <CloseOutlined />
                    </Button>
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoFocus
                />

                {/* 搜索结果 */}
                {searchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    <div className="p-4">
                      <SearchResults
                        results={results}
                        loading={loading}
                        keyword={keyword}
                        onResultClick={handleSearchResultClick}
                      />
                    </div>
                  </div>
                )}
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
        user={user.currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </motion.header>
  );
};

export default connect(({ user }: any) => ({ user }))(Header);
