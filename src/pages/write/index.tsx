import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, history } from '@umijs/max';
import { message, Modal } from 'antd';
import { 
    pageVariants, 
    containerVariants,
    scaleIn
} from '@/constants/animations';
import { 
    WriteHeader, 
    WriteEditor, 
    WriteSidebar, 
    ArticleSettings 
} from './components';
import './style.css';
import type { ArticleData } from './types';

// 预设分类
const categories = [
    '前端开发',
    '后端开发',
    '移动开发',
    '数据库',
    '系统架构',
    '编程语言',
    '开发工具',
    '算法与数据结构',
    '人工智能',
    '区块链',
    '新兴技术',
    '项目管理',
    '职业发展',
];

// 常用标签
const popularTags = [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript',
    'Node.js', 'Python', 'Java', 'Go', 'CSS',
    'HTML', 'Webpack', 'Vite', 'Git', 'Docker',
    '微服务', '云计算', '性能优化', '架构设计', 'UI设计'
];

const WritePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');
    
    const [articleData, setArticleData] = useState<ArticleData>({
        title: '',
        excerpt: '',
        content: '# 开始写作\n\n在这里开始你的创作...\n\n## 小贴士\n\n- 使用Markdown语法来格式化文章\n- 支持代码高亮\n- 支持表格、列表等格式\n\n```javascript\nconsole.log("Hello, World!");\n```\n\n> 好的开始是成功的一半',
        tags: [],
        category: '',
        isDraft: true,
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [newTag, setNewTag] = useState('');

    // 从URL参数加载文章数据（编辑模式）
    useEffect(() => {
        if (editId) {
            // 模拟加载文章数据
            setLoading(true);
            setTimeout(() => {
                // 这里应该是API调用
                const mockData = {
                    title: 'React 18 并发特性详解',
                    excerpt: '探索React 18引入的并发渲染、Suspense边界和自动批处理等革命性特性...',
                    content: '# React 18 并发特性详解\n\nReact 18 带来了许多激动人心的新特性...',
                    tags: ['React', 'JavaScript', '前端'],
                    category: '前端开发',
                    isDraft: false,
                };
                setArticleData(mockData);
                setLoading(false);
            }, 1000);
        }
    }, [editId]);

    // 自动保存
    useEffect(() => {
        const autoSave = setInterval(() => {
            if (articleData.title || articleData.content) {
                handleSaveDraft(true);
            }
        }, 30000); // 30秒自动保存

        return () => clearInterval(autoSave);
    }, [articleData]);

    // 处理内容变化
    const handleContentChange = useCallback((value: string = '') => {
        setArticleData(prev => ({ ...prev, content: value }));
    }, []);

    // 添加标签
    const handleAddTag = useCallback(() => {
        if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
            setArticleData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    }, [newTag, articleData.tags]);

    // 删除标签
    const handleRemoveTag = useCallback((tagToRemove: string) => {
        setArticleData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    }, []);

    // 保存草稿
    const handleSaveDraft = useCallback(async (isAutoSave = false) => {
        if (!articleData.title.trim() && !articleData.content.trim()) {
            return;
        }

        setSaving(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (!isAutoSave) {
                message.success('草稿保存成功');
            }
        } catch (error) {
            if (!isAutoSave) {
                message.error('保存失败，请重试');
            }
        } finally {
            setSaving(false);
        }
    }, [articleData]);

    // 发布文章
    const handlePublish = useCallback(async () => {
        if (!articleData.title.trim()) {
            message.error('请输入文章标题');
            return;
        }
        if (!articleData.content.trim()) {
            message.error('请输入文章内容');
            return;
        }
        if (!articleData.category) {
            message.error('请选择文章分类');
            return;
        }

        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            message.success('文章发布成功！');
            history.push('/my-articles');
        } catch (error) {
            message.error('发布失败，请重试');
        } finally {
            setLoading(false);
        }
    }, [articleData]);

    // 返回上一页
    const handleBack = useCallback(() => {
        if (articleData.title || articleData.content !== '# 开始写作\n\n在这里开始你的创作...') {
            Modal.confirm({
                title: '确认离开？',
                content: '您有未保存的更改，确定要离开吗？',
                onOk: () => history.back(),
            });
        } else {
            history.back();
        }
    }, [articleData]);

    // 预览功能
    const previewContent = useMemo(() => {
        return {
            title: articleData.title || '无标题',
            excerpt: articleData.excerpt || '暂无摘要',
            content: articleData.content,
            tags: articleData.tags,
            category: articleData.category || '未分类',
        };
    }, [articleData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <motion.div
                    {...scaleIn}
                    className="text-center"
                >
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">加载中...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
        >
            {/* 顶部工具栏 */}
            <WriteHeader
                editId={editId}
                saving={saving}
                loading={loading}
                previewMode={previewMode}
                onBack={handleBack}
                onSaveDraft={() => handleSaveDraft()}
                onPublish={handlePublish}
                onTogglePreview={() => setPreviewMode(!previewMode)}
                onOpenSettings={() => setSettingsVisible(true)}
            />

            {/* 主内容区域 */}
            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 py-6"
            >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* 编辑器区域 */}
                    <WriteEditor
                        title={articleData.title}
                        excerpt={articleData.excerpt}
                        content={articleData.content}
                        previewMode={previewMode}
                        onTitleChange={(title: string) => setArticleData(prev => ({ ...prev, title }))}
                        onExcerptChange={(excerpt: string) => setArticleData(prev => ({ ...prev, excerpt }))}
                        onContentChange={handleContentChange}
                    />

                    {/* 侧边栏 */}
                    <WriteSidebar
                        articleData={{
                            category: articleData.category,
                            isDraft: articleData.isDraft,
                            tags: articleData.tags,
                        }}
                        newTag={newTag}
                        categories={categories}
                        popularTags={popularTags}
                        onDataChange={(data: Partial<ArticleData>) => setArticleData(prev => ({ ...prev, ...data }))}
                        onNewTagChange={setNewTag}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                    />
                </div>
            </motion.main>

            {/* 文章设置弹窗 */}
            <ArticleSettings
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
            />
        </motion.div>
    );
};

export default WritePage;
