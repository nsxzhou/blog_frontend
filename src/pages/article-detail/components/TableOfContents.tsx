import {
  fadeInUp,
  hoverScale,
  sidebarItemVariants,
} from '@/constants/animations';
import {
  BookOutlined,
  CloseOutlined,
  HeartOutlined,
  MessageOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UpOutlined,
} from '@ant-design/icons';
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
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  isVisible,
  onToggle,
}) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 生成目录
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
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
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    message.success(isLiked ? '已取消点赞' : '点赞成功');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    message.success(isBookmarked ? '已取消收藏' : '收藏成功');
  };

  const handleComment = () => {
    const commentSection = document.querySelector('#comment-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
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
                icon={<HeartOutlined />}
                onClick={handleLike}
                className={`${
                  isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-red-400 hover:text-red-500'
                }`}
              />
            </motion.div>
          </Tooltip>

          <Tooltip title={isBookmarked ? '取消收藏' : '收藏'} placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={<BookOutlined />}
                onClick={handleBookmark}
                className={`${
                  isBookmarked
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-yellow-400 hover:text-yellow-500'
                }`}
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

          <Tooltip title="打印文章" placement="left">
            <motion.div {...hoverScale}>
              <Button
                type="text"
                shape="circle"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className="text-purple-500 hover:text-purple-600"
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
                                                        ${
                                                          activeId === item.id
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
