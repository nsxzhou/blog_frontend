import React from 'react';
import { motion } from 'framer-motion';

interface SkillCardProps {
  skill: {
    name: string;
    level: number;
    color: string;
    icon: string;
  };
  delay?: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group"
      role="progressbar"
      aria-valuenow={skill.level}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${skill.name} 技能水平 ${skill.level}%`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {skill.icon}
          </span>
          <h4 className="font-semibold text-gray-800">{skill.name}</h4>
        </div>
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
          {skill.level}%
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.5, 
              delay: delay + 0.2,
              ease: "easeOut"
            }}
          >
          </motion.div>
        </div>
        
        {/* 进度点 */}
        <motion.div
          className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-r ${skill.color} rounded-full shadow-lg border-2 border-green-500`}
          initial={{ left: 0 }}
          whileInView={{ left: `calc(${skill.level}% - 8px)` }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1.5, 
            delay: delay + 0.2,
            ease: "easeOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default SkillCard; 