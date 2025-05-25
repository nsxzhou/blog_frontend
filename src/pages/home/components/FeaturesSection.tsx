import React from 'react';
import { motion } from 'framer-motion';
import {
  BulbOutlined,
  CodeOutlined,
  GlobalOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { Card } from '@/components/ui';

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BulbOutlined className="text-2xl" />,
      title: "思维分享",
      description: "记录技术探索的心得体会",
      color: "text-yellow-600"
    },
    {
      icon: <CodeOutlined className="text-2xl" />,
      title: "技术深度",
      description: "深入解析技术原理和最佳实践",
      color: "text-blue-600"
    },
    {
      icon: <GlobalOutlined className="text-2xl" />,
      title: "开放交流",
      description: "构建开放友好的技术交流环境",
      color: "text-green-600"
    },
    {
      icon: <RocketOutlined className="text-2xl" />,
      title: "持续成长",
      description: "保持学习热情，与时俱进",
      color: "text-purple-600"
    }
  ];

  return (
    <motion.section
      variants={itemVariants}
      className="py-20 px-4 bg-gray-50/50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            为什么选择这里
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            专注于技术分享和思维碰撞的平台
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index * 0.1}
              className="relative"
            >
              <Card className="h-full">
                <div className={`inline-flex p-3 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection; 