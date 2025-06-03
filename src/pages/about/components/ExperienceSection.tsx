import {
  cardHover,
  itemVariants,
  sectionVariants,
} from '@/constants/animations';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import React from 'react';

const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      title: '全栈开发工程师',
      company: '深圳美藤科技',
      location: '深圳',
      period: '2025.03 - 2025.05',
      description: '参与多个企业级项目开发，学习全栈开发。',
      skills: [
        'React',
        'Vue',
        'TypeScript',
        'Golang',
        'MySQL',
        'Redis',
        'Docker',
      ],
    },
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
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* 时间点 */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* 内容卡片 */}
              <div
                className={`w-full md:w-5/12 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                } ml-12 md:ml-0`}
              >
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100"
                  {...cardHover}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.title}
                      </h3>
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
