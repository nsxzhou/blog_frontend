import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItemProps {
  experience: {
    period: string;
    company: string;
    position: string;
    description: string;
    technologies: string[];
    achievements: string[];
    color: string;
    icon: string;
  };
  index: number;
  isEven: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ experience, index, isEven }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
    >
      {/* 时间线节点 */}
      <motion.div
        className={`absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r ${experience.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl z-10`}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        {experience.icon}
      </motion.div>

      {/* 内容卡片 */}
      <motion.div
        className={`w-full max-w-lg ${isEven ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          {/* 时间和公司 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium px-3 py-1 bg-gradient-to-r ${experience.color} text-white rounded-full`}>
                {experience.period}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {experience.position}
            </h3>
            <p className="text-lg text-gray-700 font-medium">
              {experience.company}
            </p>
          </div>

          {/* 描述 */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {experience.description}
          </p>

          {/* 技术栈 */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">技术栈</h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 成就 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">主要成就</h4>
            <ul className="space-y-1">
              {experience.achievements.map((achievement, achievementIndex) => (
                <motion.li
                  key={achievementIndex}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1 + 0.5 + achievementIndex * 0.1 
                  }}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* 连接线装饰 */}
      <motion.div
        className={`absolute top-8 ${isEven ? 'left-1/2 ml-8' : 'right-1/2 mr-8'} w-8 h-0.5 bg-gradient-to-r ${experience.color} opacity-30`}
        initial={{ width: 0 }}
        whileInView={{ width: 32 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
      />
    </motion.div>
  );
};

export default TimelineItem; 