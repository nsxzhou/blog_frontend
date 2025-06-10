import { getRSSUrl, type RSSQuery } from '@/api/rss';
import { fadeInUp, hoverScale } from '@/constants/animations';
import { message } from 'antd';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Rss } from 'lucide-react';
import React, { useState } from 'react';

interface RSSSubscribeProps {
  params?: RSSQuery;
  className?: string;
  showTitle?: boolean;
  variant?: 'default' | 'compact' | 'button-only';
}

const RSSSubscribe: React.FC<RSSSubscribeProps> = ({
  params,
  className = '',
  showTitle = true,
  variant = 'default',
}) => {
  const [copying, setCopying] = useState(false);

  const rssUrl = getRSSUrl(params);

  // 复制RSS链接
  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(rssUrl);
      message.success('RSS链接已复制到剪贴板');
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = rssUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('RSS链接已复制到剪贴板');
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  // 打开RSS链接
  const handleOpenLink = () => {
    window.open(rssUrl, '_blank');
  };

  // 按钮样式组件
  const RSSButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    loading?: boolean;
  }> = ({ onClick, icon, text, loading }) => (
    <motion.button
      {...hoverScale}
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </motion.button>
  );

  // 仅按钮模式
  if (variant === 'button-only') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RSSButton
          onClick={handleOpenLink}
          icon={<Rss size={16} />}
          text="RSS订阅"
        />
      </div>
    );
  }

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <motion.div
        variants={fadeInUp}
        className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2 text-orange-500">
          <Rss size={18} />
          <span className="text-sm font-medium text-gray-700">RSS订阅</span>
        </div>
        <div className="flex items-center gap-2">
          <RSSButton
            onClick={handleCopyLink}
            icon={<Copy size={14} />}
            text={copying ? '已复制' : '复制链接'}
            loading={copying}
          />
          <RSSButton
            onClick={handleOpenLink}
            icon={<ExternalLink size={14} />}
            text="打开"
          />
        </div>
      </motion.div>
    );
  }

  // 默认完整模式
  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100 ${className}`}
    >
      {showTitle && (
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Rss className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">RSS订阅</h3>
            <p className="text-sm text-gray-600">订阅博客，获取最新文章更新</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <code className="flex-1 text-sm text-gray-700 break-all">
            {rssUrl}
          </code>
        </div>

        <div className="flex items-center gap-3">
          <RSSButton
            onClick={handleCopyLink}
            icon={<Copy size={16} />}
            text={copying ? '已复制' : '复制链接'}
            loading={copying}
          />
          <RSSButton
            onClick={handleOpenLink}
            icon={<ExternalLink size={16} />}
            text="在新窗口打开"
          />
        </div>

        <div className="text-xs text-gray-500 mt-3">
          <p>💡 将此链接添加到您的RSS阅读器中，如Feedly、Inoreader等</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RSSSubscribe;
