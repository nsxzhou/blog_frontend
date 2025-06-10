
import { Button } from '@/components/ui';
import { itemVariants } from '@/constants/animations';
import { ThunderboltOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

const SubscribeSection: React.FC = () => {
  return (
    <motion.section variants={itemVariants} className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            variants={itemVariants}
          >
            开启技术探索之旅
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            订阅博客，第一时间获取最新的技术文章和深度思考
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="输入邮箱地址"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => message.info('敬请期待')}
            >
              <span className="flex items-center gap-2">
                <ThunderboltOutlined />
                立即订阅
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default SubscribeSection;
