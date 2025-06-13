import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Form, Input, message } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  WechatOutlined,
  GithubOutlined,
  QqOutlined,
} from '@ant-design/icons';
import { sectionVariants, itemVariants, iconHover } from '@/constants/animations';

const ContactSection: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <MailOutlined />,
      label: '邮箱',
      value: '1790146932@qq.com',
      color: 'text-blue-500'
    },
    {
      icon: <PhoneOutlined />,
      label: '电话',
      value: '+86 13407017688',
      color: 'text-green-500'
    },
    {
      icon: <EnvironmentOutlined />,
      label: '位置',
      value: '安徽 淮南',
      color: 'text-blue-500'
    }
  ];

  const socialLinks = [
    {
      icon: <GithubOutlined />,
      label: 'GitHub',
      url: 'https://github.com/nsxzhou',
      color: 'bg-gray-800 hover:bg-gray-700'
    },
    {
      icon: <QqOutlined />,
      label: 'QQ',
      url: '#',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: <WechatOutlined />,
      label: '微信',
      url: '#',
      color: 'bg-green-500 hover:bg-green-600'
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
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">联系我</h2>
          <p className="text-lg text-gray-600">
            如果您对我感兴趣或想要合作，欢迎随时联系
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 联系信息 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">联系方式</h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`text-2xl ${item.color}`}>{item.icon}</div>
                  <div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                    <div className="text-lg font-medium text-gray-900">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 社交媒体 */}
            {/* <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">社交媒体</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${social.color}`}
                    {...iconHover}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div> */}
          </motion.div>

          {/* CTA区域 */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              准备开始合作了吗？
            </h3>
            <p className="text-gray-600 mb-6">
              我正在寻找新的机会和挑战。如果您有有趣的项目或职位机会，
              请不要犹豫联系我。我很乐意与您讨论如何为您的团队贡献价值。
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="default"
                size="large"
                className="border-gray-300"
              >
                查看作品集
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection; 