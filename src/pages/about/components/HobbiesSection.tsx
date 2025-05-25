import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const HobbiesSection: React.FC = () => {
  const hobbies = [
    {
      title: '摄影',
      icon: '📷',
      description: '喜欢用镜头记录生活中的美好瞬间，特别是自然风光和城市夜景。摄影让我学会了观察和发现美的眼光。',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-purple-500',
      tags: ['风光摄影', '街拍', '后期处理']
    },
    {
      title: '阅读',
      icon: '📚',
      description: '热爱技术书籍和科幻小说，认为阅读是获取知识和启发思维的最好方式。每年会阅读 20+ 本书。',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      color: 'from-green-500 to-blue-500',
      tags: ['技术书籍', '科幻小说', '个人成长']
    },
    {
      title: '游戏',
      icon: '🎮',
      description: '作为程序员，我对游戏设计和开发有着浓厚的兴趣。喜欢独立游戏和策略类游戏，也在学习游戏开发。',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-pink-500',
      tags: ['独立游戏', '策略游戏', 'Game Dev']
    },
    {
      title: '旅行',
      icon: '✈️',
      description: '喜欢探索不同的城市和文化，旅行让我开阔眼界，也为我的创作提供了丰富的灵感来源。',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      color: 'from-orange-500 to-red-500',
      tags: ['城市探索', '文化体验', '美食发现']
    },
    {
      title: '音乐',
      icon: '🎵',
      description: '喜欢各种类型的音乐，特别是电子音乐和爵士乐。音乐是我编程时的最佳伴侣，也是灵感的源泉。',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      color: 'from-indigo-500 to-purple-500',
      tags: ['电子音乐', '爵士乐', '音乐制作']
    },
    {
      title: '健身',
      icon: '💪',
      description: '保持身体健康对程序员来说很重要。我喜欢跑步和力量训练，这让我在工作中保持充沛的精力。',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      color: 'from-green-500 to-teal-500',
      tags: ['跑步', '力量训练', '健康生活']
    }
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-20 px-4 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            生活
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              兴趣爱好
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            工作之外，我有很多热爱的事物。这些爱好不仅丰富了我的生活，
            也为我的创意工作提供了源源不断的灵感。
          </p>
        </motion.div>

        {/* 兴趣爱好网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.title}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-500"
            >
              {/* 图片区域 */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={hobby.image}
                  alt={`${hobby.title}相关的图片`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${hobby.color} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-6xl filter drop-shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)' 
                    }}
                  >
                    {hobby.icon}
                  </motion.div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {hobby.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {hobby.description}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {hobby.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tagIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1 + tagIndex * 0.05 
                      }}
                      className={`px-3 py-1 bg-gradient-to-r ${hobby.color} text-white text-sm rounded-full font-medium`}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 生活哲学卡片 */}
        <motion.div
          variants={itemVariants}
          className="mt-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-6 text-white">工作与生活的平衡</h3>
          <p className="text-xl opacity-95 mb-8 max-w-4xl mx-auto leading-relaxed text-gray-100">
            我相信一个充实的生活能够激发更好的创造力。通过多样化的兴趣爱好，
            我不仅能够在工作中保持创新思维，也能够在生活中找到快乐和满足感。
            每一个爱好都是我个人成长路径上的重要组成部分。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-lg font-semibold mb-2">专注投入</h4>
              <p className="text-sm opacity-80">无论是工作还是爱好，我都会全身心投入</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-lg font-semibold mb-2">持续学习</h4>
              <p className="text-sm opacity-80">从每个兴趣中学习新技能和新视角</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="text-lg font-semibold mb-2">创意启发</h4>
              <p className="text-sm opacity-80">多元化的体验为技术创新提供灵感</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HobbiesSection; 