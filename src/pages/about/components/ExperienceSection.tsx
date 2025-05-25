import React from 'react';
import { motion } from 'framer-motion';
import TimelineItem from './TimelineItem';

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

const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      period: '2022 - 至今',
      company: '创新科技有限公司',
      position: '高级前端工程师',
      description: '负责公司核心产品的前端架构设计与开发，带领团队完成多个大型项目的技术升级。主导 React 18 升级方案，提升应用性能 40%。',
      technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      achievements: [
        '设计并实现了公司设计系统，提高开发效率 50%',
        '优化核心产品性能，首屏加载时间减少 60%',
        '指导 5 名初级工程师成长为独立开发者'
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: '🚀'
    },
    {
      period: '2021 - 2022',
      company: '数字化解决方案公司',
      position: '前端工程师',
      description: '参与多个客户项目的前端开发，积累了丰富的业务场景经验。专注于用户体验优化和前端工程化建设。',
      technologies: ['Vue.js', 'React', 'Webpack', 'Sass'],
      achievements: [
        '独立完成 3 个中大型项目的前端开发',
        '建立前端代码规范和自动化部署流程',
        '获得年度优秀员工奖'
      ],
      color: 'from-green-500 to-emerald-500',
      icon: '💼'
    },
    {
      period: '2020 - 2021',
      company: '互联网创业公司',
      position: '全栈开发工程师',
      description: '在快节奏的创业环境中，负责产品的全栈开发。从前端界面到后端 API，从数据库设计到部署运维，积累了全面的技术经验。',
      technologies: ['Node.js', 'Express', 'MongoDB', 'React'],
      achievements: [
        '从零开始构建公司核心产品',
        '实现用户增长 10 倍的产品功能',
        '建立完整的 CI/CD 部署流程'
      ],
      color: 'from-purple-500 to-pink-500',
      icon: '⚡'
    },
    {
      period: '2019 - 2020',
      company: '计算机科学专业',
      position: '本科毕业 / 实习经历',
      description: '在大学期间通过课程学习和实习项目，奠定了扎实的计算机基础。参与了多个开源项目，开始了我的编程之旅。',
      technologies: ['JavaScript', 'Python', 'Java', 'C++'],
      achievements: [
        '计算机科学学士学位，GPA 3.8/4.0',
        '参与 5 个开源项目，获得 500+ GitHub stars',
        '获得校级程序设计竞赛一等奖'
      ],
      color: 'from-orange-500 to-red-500',
      icon: '🎓'
    }
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            职业
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              成长历程
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            从初学者到专业开发者，每一步都充满挑战与成长。
            这里记录了我的技术之路和职业发展轨迹。
          </p>
        </motion.div>

        {/* 时间线 */}
        <div className="relative">
          {/* 时间线主线 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20"></div>
          
          {/* 时间线项目 */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <TimelineItem
                key={index}
                experience={experience}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* 总结卡片 */}
        <motion.div
          variants={itemVariants}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-6">持续成长中...</h3>
          <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto">
            技术之路永无止境，我将继续在这个充满可能性的领域中探索、学习、创新。
            期待与更多优秀的团队和项目合作，创造更大的价值。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              <span className="text-2xl">🎯</span>
              <span>目标导向</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              <span className="text-2xl">🤝</span>
              <span>团队协作</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
              <span className="text-2xl">💡</span>
              <span>创新思维</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection; 