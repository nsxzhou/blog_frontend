import { ArticleAction } from '@/api/article';
import {
  fadeInUp,
  hoverScale,
  sidebarItemVariants,
} from '@/constants/animations';
import {
  BookFilled,
  BookOutlined,
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Tooltip, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  isVisible: boolean;
  onToggle: () => void;
  articleId: number;
  initialLiked?: boolean;
  initialFavorited?: boolean;
  onLikeUpdate?: (liked: boolean, likeCount: number) => void;
  onFavoriteUpdate?: (favorited: boolean, favoriteCount: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  isVisible,
  onToggle,
  articleId,
  initialLiked = false,
  initialFavorited = false,
  onLikeUpdate,
  onFavoriteUpdate,
}) => {
  const { initialState } = useModel('@@initialState');
  const { isLoggedIn } = initialState || {};

  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(true);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialFavorited);
  const [actionLoading, setActionLoading] = useState<{
    like: boolean;
    bookmark: boolean;
  }>({ like: false, bookmark: false });

  // 更新初始状态
  useEffect(() => {
    setIsLiked(initialLiked);
    setIsBookmarked(initialFavorited);
  }, [initialLiked, initialFavorited]);

  // 生成目录
  useEffect(() => {
    // 只在文章内容区域查找标题，避免抓取页面其他区域的标题
    const articleContent = document.querySelector('article') || document.querySelector('.prose');

    if (!articleContent) {
      setTocItems([]);
      return;
    }

    const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      // 为标题添加id
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      return {
        id,
        title: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setTocItems(items);
  }, []);

  // 监听滚动，更新活跃状态
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // 检查是否显示回到顶部按钮
      setShowScrollTop(window.scrollY > 500);

      // 找到当前活跃的标题
      let currentActiveId = '';

      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (elementTop <= scrollPosition) {
            currentActiveId = item.id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  // 滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      const offsetTop = element.offsetTop - 120; // 考虑固定头部的高度
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 交互功能处理函数
  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/article-detail/${articleId}`,
    );
    message.success('链接已复制到剪贴板');
  };

  // 检查登录状态的辅助函数
  const checkLoginStatus = () => {
    if (!isLoggedIn) {
      message.warning('请先登录后再进行操作');
      // 跳转到登录页面，并在登录成功后返回当前页面
      history.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    // 检查登录状态
    if (!checkLoginStatus()) {
      return;
    }

    if (actionLoading.like) return;

    const newLikedState = !isLiked;
    const action = newLikedState ? 'like' : 'unlike';

    setActionLoading((prev) => ({ ...prev, like: true }));
    try {
      await ArticleAction(articleId, { action });
      setIsLiked(newLikedState);
      message.success(newLikedState ? '点赞成功' : '已取消点赞');
    } catch (error) {
      console.error('点赞操作失败:', error);
      message.error('操作失败，请稍后重试');
    } finally {
      setActionLoading((prev) => ({ ...prev, like: false }));
    }
  };

  const handleBookmark = async () => {
    // 检查登录状态
    if (!checkLoginStatus()) {
      return;
    }

    if (actionLoading.bookmark) return;

    const newBookmarkedState = !isBookmarked;
    const action = newBookmarkedState ? 'favorite' : 'unfavorite';

    setActionLoading((prev) => ({ ...prev, bookmark: true }));

    try {
      await ArticleAction(articleId, { action });
      setIsBookmarked(newBookmarkedState);
      message.success(newBookmarkedState ? '收藏成功' : '已取消收藏');
    } catch (error) {
      console.error('收藏操作失败:', error);
      message.error('操作失败，请稍后重试');
    } finally {
      setActionLoading((prev) => ({ ...prev, bookmark: false }));
    }
  };

  const handleComment = () => {
    const commentSection = document.querySelector('#comment-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed right-6 bottom-6 z-40"
          >
            <motion.div {...hoverScale}>
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<UpOutlined />}
                onClick={scrollToTop}
                className="shadow-lg bg-blue-500 hover:bg-blue-600 border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 右侧交互工具栏 */}
      <div className="hidden lg:block fixed right-6 top-1/3 z-30">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white rounded-full shadow-lg p-2 flex flex-col gap-2"
        >
          <Tooltip title="展开目录" placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={<UnorderedListOutlined />}
                onClick={() => setTocCollapsed(false)}
                className="text-blue-500 hover:text-blue-600"
              />
            </motion.div>
          </Tooltip>

          <Tooltip title="分享文章" placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                className="text-blue-500 hover:text-blue-600"
              />
            </motion.div>
          </Tooltip>

          <Tooltip title={isLiked ? '取消点赞' : '点赞'} placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleLike}
                loading={actionLoading.like}
                className={`${isLiked
                  ? 'text-red-500 hover:text-red-600 bg-red-50'
                  : 'text-red-400 hover:text-red-500 hover:bg-red-50'
                  } transition-all duration-200`}
              />
            </motion.div>
          </Tooltip>

          <Tooltip title={isBookmarked ? '取消收藏' : '收藏'} placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={isBookmarked ? <BookFilled /> : <BookOutlined />}
                onClick={handleBookmark}
                loading={actionLoading.bookmark}
                className={`${isBookmarked
                  ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50'
                  : 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-50'
                  } transition-all duration-200`}
              />
            </motion.div>
          </Tooltip>

          <Tooltip title="跳到评论" placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={<MessageOutlined />}
                onClick={handleComment}
                className="text-green-500 hover:text-green-600"
              />
            </motion.div>
          </Tooltip>
        </motion.div>
      </div>

      {/* 桌面端目录 - 添加收起功能 */}
      <AnimatePresence>
        {!tocCollapsed && (
          <div className="hidden xl:block fixed right-20 top-1/2 transform -translate-y-1/2 w-64 z-30">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* 目录头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <UnorderedListOutlined className="text-blue-500" />
                  文章目录
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => setTocCollapsed(true)}
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>

              {/* 目录内容 */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="max-h-80 overflow-y-auto"
              >
                <nav className="p-4">
                  <ul className="space-y-1">
                    {tocItems.map((item, index) => (
                      <motion.li
                        key={item.id}
                        variants={sidebarItemVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                      >
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className={`
                                                        w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-200
                                                        ${activeId === item.id
                              ? 'bg-blue-50 text-blue-600 border-l-3 border-blue-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                                                    `}
                          style={{
                            paddingLeft: `${0.75 + (item.level - 1) * 0.5}rem`,
                          }}
                        >
                          <span className="line-clamp-2 leading-relaxed">
                            {item.title}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;
