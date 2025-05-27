import React from 'react';
import { motion } from 'framer-motion';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { sectionVariants, itemVariants } from '@/constants/animations';

const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      title: '高级前端工程师',
      company: 'TechCorp',
      location: '北京',
      period: '2022.01 - 至今',
      description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个大型项目。',
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL']
    },
    {
      title: '前端工程师',
      company: 'StartupXYZ',
      location: '上海',
      period: '2020.06 - 2021.12',
      description: '从零搭建公司前端技术栈，开发多个用户端和管理端应用。',
      skills: ['Vue.js', 'Node.js', 'MongoDB', 'Docker']
    },
    {
      title: '初级前端开发',
      company: 'WebStudio',
      location: '深圳',
      period: '2019.03 - 2020.05',
      description: '参与多个企业级项目开发，学习现代前端开发技术和最佳实践。',
      skills: ['JavaScript', 'CSS3', 'jQuery', 'Bootstrap']
    }
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="py-20 px-4 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">工作经验</h2>
          <p className="text-lg text-gray-600">我的职业发展历程</p>
        </motion.div>

        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-blue-200"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
            >
              {/* 时间点 */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* 内容卡片 */}
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} ml-12 md:ml-0`}>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      {exp.period}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <EnvironmentOutlined className="mr-1" />
                    {exp.location}
                    <CalendarOutlined className="ml-4 mr-1" />
                    {exp.period}
                  </div>

                  <p className="text-gray-600 mb-4">{exp.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection; 