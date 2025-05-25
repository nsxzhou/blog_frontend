import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Form, Input, message } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  WechatOutlined,
  GithubOutlined,
  LinkedinOutlined,
  SendOutlined
} from '@ant-design/icons';

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

const ContactSection: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <MailOutlined className="text-2xl" />,
      label: '邮箱',
      value: 'zhouzirui@example.com',
      color: 'from-blue-500 to-cyan-500',
      action: 'mailto:zhouzirui@example.com'
    },
    {
      icon: <WechatOutlined className="text-2xl" />,
      label: '微信',
      value: 'zhouzirui_dev',
      color: 'from-green-500 to-emerald-500',
      action: '#'
    },
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      label: '位置',
      value: '中国 · 上海',
      color: 'from-purple-500 to-pink-500',
      action: '#'
    },
    {
      icon: <PhoneOutlined className="text-2xl" />,
      label: '电话',
      value: '+86 138 0000 0000',
      color: 'from-orange-500 to-red-500',
      action: 'tel:+8613800000000'
    }
  ];

  const socialLinks = [
    {
      icon: <GithubOutlined />,
      name: 'GitHub',
      url: 'https://github.com/zhouzirui',
      color: 'bg-gray-800 hover:bg-gray-700'
    },
    {
      icon: <LinkedinOutlined />,
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/zhouzirui',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: <MailOutlined />,
      name: 'Email',
      url: 'mailto:zhouzirui@example.com',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    // 模拟提交过程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('消息发送成功！我会尽快回复您。');
      form.resetFields();
    } catch (error) {
      message.error('发送失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            联系
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              我
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            有项目合作想法？想要技术交流？或者只是想打个招呼？
            我很乐意与您取得联系，期待我们的对话！
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 联系信息 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-8 text-gray-800">联系信息</h3>
            
            {/* 联系方式卡片 */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.action}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {contact.icon}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">{contact.label}</h4>
                    <p className="text-gray-600">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* 社交媒体链接 */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800">社交媒体</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 ${social.color} text-white rounded-xl flex items-center justify-center text-lg transition-all duration-300`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 联系表单 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-8 text-gray-800">发送消息</h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入您的姓名' }]}
                >
                  <Input 
                    size="large" 
                    placeholder="请输入您的姓名"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入您的邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input 
                    size="large" 
                    placeholder="请输入您的邮箱"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="主题"
                  rules={[{ required: true, message: '请输入消息主题' }]}
                >
                  <Input 
                    size="large" 
                    placeholder="请输入消息主题"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="消息内容"
                  rules={[{ required: true, message: '请输入消息内容' }]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="请输入您的消息内容..."
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isSubmitting}
                    icon={<SendOutlined />}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-none font-semibold"
                  >
                    {isSubmitting ? '发送中...' : '发送消息'}
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          </motion.div>
        </div>

        {/* 结束语 */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900">期待与您的合作</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            无论您是想要讨论项目合作、技术交流，还是仅仅想要打个招呼，
            我都很乐意与您建立联系。让我们一起创造些令人惊喜的东西！
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection; 