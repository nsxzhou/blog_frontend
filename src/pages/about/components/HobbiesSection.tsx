import React from 'react';
import { motion } from 'framer-motion';
import { sectionVariants, itemVariants } from '@/constants/animations';

const HobbiesSection: React.FC = () => {
  const hobbies = [
    {
      icon: '🎸',
      title: '音乐',
      description: '喜欢弹吉他和钢琴，偶尔创作一些小曲子'
    },
    {
      icon: '📚',
      title: '阅读',
      description: '热爱技术书籍和科幻小说，保持持续学习'
    },
    {
      icon: '🏃‍♂️',
      title: '运动',
      description: '跑步和健身是我保持活力的秘诀'
    },
    {
      icon: '📷',
      title: '摄影',
      description: '用镜头记录生活中的美好瞬间'
    },
    {
      icon: '🎮',
      title: '游戏',
      description: '偶尔玩玩独立游戏放松身心'
    },
    {
      icon: '✈️',
      title: '旅行',
      description: '喜欢探索不同的城市和文化'
    }
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-20 px-4 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">兴趣爱好</h2>
          <p className="text-lg text-gray-600">工作之余的生活乐趣</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-4xl mb-4">{hobby.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {hobby.title}
              </h3>
              <p className="text-gray-600">{hobby.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HobbiesSection; 