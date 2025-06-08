import { fadeInUp } from '@/constants/animations';
import { HistoryOutlined, ReadOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

const EmptyState: React.FC = () => {
  const handleGoToBlog = () => {
    history.push('/blog');
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="text-center max-w-md">
        {/* 图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <HistoryOutlined className="text-4xl text-blue-500" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <ReadOutlined className="text-gray-400 text-sm" />
            </motion.div>
          </div>
        </motion.div>

        {/* 标题 */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-3"
        >
          暂无阅读记录
        </motion.h3>

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          您还没有阅读过任何文章。
          <br />
          快去发现一些有趣的内容吧！
        </motion.p>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            type="primary"
            size="large"
            icon={<ReadOutlined />}
            onClick={handleGoToBlog}
            className="w-full sm:w-auto px-8"
          >
            去阅读文章
          </Button>
        </motion.div>

        {/* 装饰性元素 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex justify-center space-x-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="w-2 h-2 bg-blue-200 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
