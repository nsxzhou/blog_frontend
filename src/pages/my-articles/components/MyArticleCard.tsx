import type { ArticleListItem } from '@/api/article';
import { UpdateArticleAccess, UpdateArticleStatus } from '@/api/article';
import { UserAvatar } from '@/components/ui';
import {
  cardHover,
  hoverScaleSmall,
  imageVariants,
  itemVariants,
  modalVariants,
  overlayVariants,
  titleVariants,
} from '@/constants/animations';
import {
  CalendarOutlined,
  CheckOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FireOutlined,
  GlobalOutlined,
  HeartOutlined,
  KeyOutlined,
  LoadingOutlined,
  MoreOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { history, useRequest } from '@umijs/max';
import { Dropdown, Input, message, Modal } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface MyArticleCardProps {
  article: ArticleListItem;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onShare: (id: number) => void;
  onRefresh?: () => void;
}

// 状态配置
const statusConfig = {
  draft: {
    label: '草稿',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <EditOutlined />,
  },
  published: {
    label: '已发布',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckOutlined />,
  },
};

// 访问权限配置
const accessConfig = {
  public: {
    label: '公开',
    color: 'bg-blue-100 text-blue-700',
    icon: <GlobalOutlined />,
  },
  private: {
    label: '私密',
    color: 'bg-red-100 text-red-700',
    icon: <EyeInvisibleOutlined />,
  },
  password: {
    label: '密码',
    color: 'bg-purple-100 text-purple-700',
    icon: <KeyOutlined />,
  },
};

const MyArticleCard: React.FC<MyArticleCardProps> = ({
  article,
  index,
  onEdit,
  onDelete,
  onShare,
  onRefresh,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  // 状态更新请求
  const { run: updateStatus, loading: statusLoading } = useRequest(
    (status: 'draft' | 'published') =>
      UpdateArticleStatus(article.id, { status }),
    {
      manual: true,
      onSuccess: () => {
        message.success('状态更新成功');
        onRefresh?.();
      },
      onError: (error) => {
        console.error('状态更新失败:', error);
      },
    },
  );

  // 访问权限更新请求
  const { run: updateAccess, loading: accessLoading } = useRequest(
    (accessType: 'public' | 'private' | 'password', pwd?: string) =>
      UpdateArticleAccess(article.id, {
        access_type: accessType,
        password: pwd,
      }),
    {
      manual: true,
      onSuccess: () => {
        message.success('访问权限更新成功');
        setShowPasswordModal(false);
        setPassword('');
        onRefresh?.();
      },
      onError: (error) => {
        console.error('访问权限更新失败:', error);
      },
    },
  );

  const handleCardClick = () => {
    if (showActions) {
      setShowActions(false);
      return;
    }
    history.push(`/article-detail/${article.id}`);
  };

  const handleStatusChange = (status: 'draft' | 'published') => {
    Modal.confirm({
      title: `确认${status === 'published' ? '发布' : '转为草稿'}？`,
      content: `您确定要将文章${status === 'published' ? '发布' : '转为草稿'
        }吗？`,
      onOk: () => updateStatus(status),
    });
    setShowActions(false);
  };

  const handleAccessChange = (
    accessType: 'public' | 'private' | 'password',
  ) => {
    if (accessType === 'password') {
      setShowPasswordModal(true);
    } else {
      updateAccess(accessType);
    }
    setShowActions(false);
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      message.error('请输入密码');
      return;
    }
    updateAccess('password', password);
  };

  const handleMenuClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // ESC键关闭菜单
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showActions]);

  const currentStatus =
    statusConfig[article.status as keyof typeof statusConfig];
  const currentAccess =
    accessConfig[article.access_type as keyof typeof accessConfig];

  // 状态切换菜单项
  const statusMenuItems = [
    {
      key: 'published',
      label: (
        <div className="flex items-center gap-2">
          <CheckOutlined />
          <span>发布文章</span>
        </div>
      ),
      disabled: article.status === 'published' || statusLoading,
      onClick: () => handleStatusChange('published'),
    },
    {
      key: 'draft',
      label: (
        <div className="flex items-center gap-2">
          <EditOutlined />
          <span>转为草稿</span>
        </div>
      ),
      disabled: article.status === 'draft' || statusLoading,
      onClick: () => handleStatusChange('draft'),
    },
  ];

  // 访问权限菜单项
  const accessMenuItems = [
    {
      key: 'public',
      label: (
        <div className="flex items-center gap-2">
          <GlobalOutlined />
          <span>公开访问</span>
        </div>
      ),
      disabled: article.access_type === 'public' || accessLoading,
      onClick: () => handleAccessChange('public'),
    },
    {
      key: 'private',
      label: (
        <div className="flex items-center gap-2">
          <EyeInvisibleOutlined />
          <span>私密访问</span>
        </div>
      ),
      disabled: article.access_type === 'private' || accessLoading,
      onClick: () => handleAccessChange('private'),
    },
    {
      key: 'password',
      label: (
        <div className="flex items-center gap-2">
          <KeyOutlined />
          <span>密码访问</span>
        </div>
      ),
      disabled: accessLoading,
      onClick: () => handleAccessChange('password'),
    },
  ];

  return (
    <>
      <motion.article
        variants={itemVariants}
        custom={index}
        layout
        onClick={handleCardClick}
        className="group relative cursor-pointer"
      >
        <motion.div
          variants={cardHover}
          initial="rest"
          whileHover="hover"
          className={`overflow-hidden h-full bg-white rounded-lg border border-gray-200 shadow-md ${article.is_top === 1 ? 'ring-2 ring-blue-200' : ''
            }`}
        >
          {/* 置顶标签 */}
          {article.is_top === 1 && (
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <FireOutlined />
                置顶
              </motion.div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              {...hoverScaleSmall}
            >
              <MoreOutlined />
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  {...modalVariants}
                  className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[160px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) =>
                      handleMenuClick(e, () => onEdit(article.id))
                    }
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <EditOutlined />
                    <span>编辑文章</span>
                  </button>

                  {/* 状态切换子菜单 */}
                  <Dropdown
                    menu={{ items: statusMenuItems }}
                    trigger={['hover']}
                    placement="topLeft"
                  >
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {statusLoading ? (
                          <LoadingOutlined />
                        ) : (
                          currentStatus?.icon
                        )}
                        <span>状态管理</span>
                      </div>
                      <span>›</span>
                    </button>
                  </Dropdown>

                  {/* 访问权限子菜单 */}
                  <Dropdown
                    menu={{ items: accessMenuItems }}
                    trigger={['hover']}
                    placement="topLeft"
                  >
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {accessLoading ? (
                          <LoadingOutlined />
                        ) : (
                          currentAccess?.icon
                        )}
                        <span>访问权限</span>
                      </div>
                      <span>›</span>
                    </button>
                  </Dropdown>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={(e) =>
                      handleMenuClick(e, () => onShare(article.id))
                    }
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ShareAltOutlined />
                    <span>分享文章</span>
                  </button>

                  <button
                    onClick={(e) =>
                      handleMenuClick(e, () => onDelete(article.id))
                    }
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <DeleteOutlined />
                    <span>删除文章</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 文章图片 */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
              variants={imageVariants}
            />
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            />
          </div>

          <div className="p-6">
            {/* 状态和权限标签 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md border ${currentStatus?.color}`}
                >
                  <span className="flex items-center gap-1">
                    {currentStatus?.icon}
                    {currentStatus?.label}
                  </span>
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${currentAccess?.color}`}
                >
                  <span className="flex items-center gap-1">
                    {currentAccess?.icon}
                    {currentAccess?.label}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  {new Date(
                    article.published_at || article.created_at,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* 分类标签 */}
            <div className="mb-3">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {article.category_name}
              </span>
            </div>

            {/* 文章标题 */}
            <motion.h3
              variants={titleVariants}
              className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
            >
              {article.title}
            </motion.h3>

            {/* 文章摘要 */}
            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 text-sm">
              {article.summary}
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-1 mb-4">
              {article.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.span
                  key={tagIndex}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#e5e7eb',
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag.name}
                </motion.span>
              ))}
              {article.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{article.tags.length - 3}
                </span>
              )}
            </div>

            {/* 作者和统计信息 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <UserAvatar
                  user={{ username: article.author_name, avatar: '' }}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600">
                  {article.author_name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <EyeOutlined />
                  {article.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <HeartOutlined />
                  {article.like_count}
                </span>
                <span className="flex items-center gap-1">
                  <CommentOutlined />
                  {article.comment_count}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.article>

      {/* 密码设置模态框 */}
      <Modal
        title="设置访问密码"
        open={showPasswordModal}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setShowPasswordModal(false);
          setPassword('');
        }}
        confirmLoading={accessLoading}
        destroyOnHidden
      >
        <div className="py-4">
          <Input.Password
            placeholder="请输入访问密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handlePasswordSubmit}
            autoFocus
          />
          <p className="text-gray-500 text-sm mt-2">
            设置密码后，访问者需要输入正确密码才能查看文章内容
          </p>
        </div>
      </Modal>
    </>
  );
};

export default MyArticleCard;
