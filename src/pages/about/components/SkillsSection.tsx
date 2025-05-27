import React from 'react';
import { motion } from 'framer-motion';
import SkillCard from './SkillCard';
import { containerVariantsMedium, itemVariantsLarge } from '@/constants';

const SkillsSection: React.FC = () => {
  const frontendSkills = [
    { name: 'React', level: 95, color: 'from-blue-500 to-cyan-500', icon: '⚛️' },
    { name: 'TypeScript', level: 90, color: 'from-blue-600 to-indigo-600', icon: '📘' },
    { name: 'Vue.js', level: 85, color: 'from-green-500 to-emerald-500', icon: '💚' },
    { name: 'Next.js', level: 88, color: 'from-gray-800 to-gray-600', icon: '▲' },
    { name: 'Tailwind CSS', level: 92, color: 'from-cyan-500 to-blue-500', icon: '🎨' },
    { name: 'Framer Motion', level: 85, color: 'from-purple-500 to-pink-500', icon: '🎬' }
  ];

  const backendSkills = [
    { name: 'Node.js', level: 88, color: 'from-green-600 to-lime-600', icon: '🟢' },
    { name: 'Express', level: 85, color: 'from-gray-700 to-gray-500', icon: '🚂' },
    { name: 'MongoDB', level: 80, color: 'from-green-500 to-teal-500', icon: '🍃' },
    { name: 'PostgreSQL', level: 75, color: 'from-blue-700 to-indigo-700', icon: '🐘' },
    { name: 'GraphQL', level: 70, color: 'from-pink-500 to-rose-500', icon: '🔗' },
    { name: 'Docker', level: 72, color: 'from-blue-500 to-blue-700', icon: '🐳' }
  ];

  const toolsSkills = [
    { name: 'Git', level: 95, color: 'from-orange-500 to-red-500', icon: '📂' },
    { name: 'VS Code', level: 98, color: 'from-blue-600 to-purple-600', icon: '💻' },
    { name: 'Figma', level: 82, color: 'from-purple-500 to-indigo-500', icon: '🎨' },
    { name: 'Webpack', level: 78, color: 'from-blue-400 to-blue-600', icon: '📦' },
    { name: 'Jest', level: 85, color: 'from-red-500 to-pink-500', icon: '🧪' },
    { name: 'Vercel', level: 90, color: 'from-gray-800 to-black', icon: '▲' }
  ];

  return (
    <motion.section
      variants={containerVariantsMedium}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-20 px-4 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <motion.div variants={itemVariantsLarge} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            技术
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              技能栈
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            在不断变化的技术世界中，我持续学习和掌握各种前沿技术，
            致力于构建高质量的现代化应用程序。
          </p>
        </motion.div>

        {/* 前端技能 */}
        <motion.div variants={itemVariantsLarge} className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
            <span className="mr-3">🎨</span>
            前端开发
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frontendSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} delay={index * 0.05} />
            ))}
          </div>
        </motion.div>

        {/* 后端技能 */}
        <motion.div variants={itemVariantsLarge} className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
            <span className="mr-3">⚙️</span>
            后端开发
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backendSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} delay={index * 0.05} />
            ))}
          </div>
        </motion.div>

        {/* 工具和平台 */}
        <motion.div variants={itemVariantsLarge}>
          <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
            <span className="mr-3">🛠️</span>
            开发工具
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} delay={index * 0.05} />
            ))}
          </div>
        </motion.div>

        {/* 技能亮点 */}
        <motion.div
          variants={itemVariantsLarge}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-6">持续学习，永不止步</h3>
          <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
            技术日新月异，我相信保持学习的心态是成为优秀开发者的关键。
            目前正在深入学习 WebAssembly、Rust 和 Machine Learning 等前沿技术。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              WebAssembly
            </span>
            <span className="px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              Rust
            </span>
            <span className="px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              Machine Learning
            </span>
            <span className="px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              Web3
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SkillsSection; 