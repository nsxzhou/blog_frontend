import { GetCategoryList, type CategoryInfo } from '@/api/category';
import QRCodeModal from '@/components/ui/QRCodeModal';
import {
  EditOutlined,
  FileTextOutlined,
  GithubOutlined,
  HeartFilled,
  HomeOutlined,
  QqOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Link, history } from '@umijs/max';
import { Button, message } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// 定义链接类型
type FooterLink =
  | { name: string; path: string; icon?: React.ReactElement; isAction?: false }
  | { name: string; onClick: () => void; isAction: true };

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [qrType, setQrType] = useState<'wechat' | 'qq' | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetCategoryList({ is_visible: 1, page_size: 6 });
        if (response.code === 0 && response.data) {
          setCategories(response.data.list || []);
        }
      } catch (error) {
        console.error('获取分类列表失败:', error);
      }
    };

    fetchCategories();
  }, []);

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

  // 处理分类点击
  const handleCategoryClick = (categoryName: string) => {
    // 跳转到 blog 页面并设置分类筛选
    history.push(`/blog?category=${encodeURIComponent(categoryName)}`);
  };

  // 处理敬请期待的功能点击
  const handleComingSoon = () => {
    message.info(`敬请期待！`);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <GithubOutlined />,
      url: 'https://github.com/nsxzhou',
      onClick: () => handleSocialClick('github'),
      color: 'hover:text-gray-700',
    },
    {
      name: '微信',
      icon: <WechatOutlined />,
      url: '#',
      onClick: () => handleSocialClick('wechat'),
      color: 'hover:text-green-500',
    },
    {
      name: 'QQ',
      icon: <QqOutlined />,
      url: '#',
      onClick: () => handleSocialClick('qq'),
      color: 'hover:text-blue-500',
    },
  ];

  const footerSections: FooterSection[] = [
    {
      title: '导航',
      links: [
        { name: '首页', path: '/', icon: <HomeOutlined /> },
        { name: '文章', path: '/blog', icon: <FileTextOutlined /> },
        { name: '关于', path: '/about', icon: <UserOutlined /> },
        { name: '写作', path: '/write', icon: <EditOutlined /> },
      ],
    },
    {
      title: '分类',
      links: categories.map((category) => ({
        name: category.name,
        onClick: () => handleCategoryClick(category.name),
        isAction: true as const,
      })),
    },
    {
      title: '资源',
      links: [
        {
          name: '归档',
          onClick: () => handleComingSoon(),
          isAction: true as const,
        },
        {
          name: 'RSS订阅',
          onClick: () => handleComingSoon(),
          isAction: true as const,
        },
      ],
    },
  ];

  return (
    <footer className="relative bg-gray-50 border-t border-gray-200">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* 品牌区域 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-flex items-center space-x-3 mb-4">
                <span className="font-bold text-2xl text-gray-800">
                  思维笔记
                </span>
              </Link>

              <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                记录技术探索的点滴思考，分享编程智慧与成长感悟。
                每一行代码都值得深度思考。
              </p>

              {/* 社交媒体链接 */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.button
                    key={social.name}
                    onClick={social.onClick}
                    className={`p-2 rounded-lg text-gray-400 transition-colors duration-200 ${social.color} hover:bg-white cursor-pointer`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {social.icon}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 导航链接区域 */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: sectionIndex * 0.1 + linkIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                    >
                      {link.isAction ? (
                        <button
                          onClick={link.onClick}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group cursor-pointer text-left"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.name}
                          </span>
                        </button>
                      ) : (
                        <Link
                          to={link.path}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        >
                          {link.icon && (
                            <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                              {link.icon}
                            </span>
                          )}
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.name}
                          </span>
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* 分割线 */}
        <motion.div
          className="border-t border-gray-200 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* 版权信息 */}
            <motion.div
              className="flex items-center space-x-2 text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span>© {currentYear} 思维笔记</span>
              <span>•</span>
              <span>Made with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-red-500"
              >
                <HeartFilled />
              </motion.span>
              <span>By NSXZHOU</span>
            </motion.div>

            {/* 法律链接 */}
            <motion.div
              className="flex items-center space-x-6 text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                type="text"
                className="hover:text-gray-700 transition-colors duration-200"
                onClick={() => handleComingSoon()}
              >
                隐私政策
              </Button>
              <Button
                type="text"
                className="hover:text-gray-700 transition-colors duration-200"
              >
                使用条款
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 二维码模态框 */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setQrType(null);
        }}
        type={qrType}
      />
    </footer>
  );
};

export default Footer;
