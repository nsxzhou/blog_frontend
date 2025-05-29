import {
  containerVariants,
  pageVariants,
  scaleIn,
} from '@/constants/animations';
import { history, useSearchParams } from '@umijs/max';
import { message, Modal } from 'antd';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
// 导入真正的API接口
import {
  CreateArticle,
  GetArticleDetail,
  UpdateArticle,
  type CreateArticleReq,
  type UpdateArticleReq,
} from '@/api/article';
import { GetCategoryList, type CategoryInfo } from '@/api/category';
import { CreateTag, GetTagList, type TagInfo } from '@/api/tag';
import {
  ArticleSettings,
  WriteEditor,
  WriteHeader,
  WriteSidebar,
} from './components';
import './style.css';
import type { ArticleData } from './types';

const WritePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [articleData, setArticleData] = useState<ArticleData>({
    title: '',
    excerpt: '',
    content:
      '# 开始写作\n\n在这里开始你的创作...\n\n## 小贴士\n\n- 使用Markdown语法来格式化文章\n- 支持代码高亮\n- 支持表格、列表等格式\n\n```javascript\nconsole.log("Hello, World!");\n```\n\n> 好的开始是成功的一半',
    tags: [],
    category: '',
    coverImage: '',
    isDraft: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [newTag, setNewTag] = useState('');

  // 分类和标签数据
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [popularTags, setPopularTags] = useState<TagInfo[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  // 当前编辑的文章ID
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);

  // 加载分类列表
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await GetCategoryList({
        page: 1,
        page_size: 50,
        is_visible: 1,
      });
      console.log(response);
      if (response.code === 0) {
        setCategories(response.data.list);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
      message.error('加载分类失败');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // 加载标签列表
  const loadTags = useCallback(async () => {
    setTagsLoading(true);
    try {
      const response = await GetTagList({ page: 1, page_size: 50 });
      if (response.code === 0) {
        setPopularTags(response.data.list);
      }
    } catch (error) {
      console.error('加载标签失败:', error);
      message.error('加载标签失败');
    } finally {
      setTagsLoading(false);
    }
  }, []);

  // 从URL参数加载文章数据（编辑模式）
  const loadArticleData = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await GetArticleDetail(parseInt(id));
      if (response.code === 0) {
        const article = response.data;
        setArticleData({
          title: article.title,
          excerpt: article.summary,
          content: article.content,
          tags: article.tags.map((tag) => tag.name),
          category: article.category_name,
          coverImage: article.cover_image,
          isDraft: article.status === 'draft',
        });
        setCurrentArticleId(article.id);
      } else {
        message.error('加载文章失败');
        history.back();
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      message.error('加载文章失败');
      history.back();
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件初始化
  useEffect(() => {
    // 加载基础数据
    loadCategories();
    loadTags();

    // 如果是编辑模式，加载文章数据
    if (editId) {
      loadArticleData(editId);
    }
  }, [editId, loadCategories, loadTags, loadArticleData]);

  // 处理内容变化
  const handleContentChange = useCallback((value: string = '') => {
    setArticleData((prev) => ({ ...prev, content: value }));
  }, []);

  // 添加标签
  const handleAddTag = useCallback(async () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      try {
        // 如果标签不存在，先创建标签
        const existingTag = popularTags.find(
          (tag) => tag.name === newTag.trim(),
        );
        if (!existingTag) {
          const createTagResponse = await CreateTag({ name: newTag.trim() });
          if (createTagResponse.code === 0) {
            // 重新加载标签列表
            await loadTags();
          }
        }

        setArticleData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
        setNewTag('');
      } catch (error) {
        console.error('创建标签失败:', error);
        // 即使创建标签失败，也允许添加到本地
        setArticleData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
        setNewTag('');
      }
    }
  }, [newTag, articleData.tags, popularTags, loadTags]);

  // 删除标签
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setArticleData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  // 保存草稿
  const handleSaveDraft = useCallback(
    async (isAutoSave = false) => {
      if (!articleData.title.trim() && !articleData.content.trim()) {
        return;
      }

      setSaving(true);
      try {
        // 查找分类ID
        const category = categories.find(
          (cat) => cat.name === articleData.category,
        );
        const categoryId = category?.id || 1; // 默认分类ID

        // 查找标签ID
        const tagIds = articleData.tags
          .map((tagName) => {
            const tag = popularTags.find((t) => t.name === tagName);
            return tag?.id || 0; // 如果找不到标签，使用0
          })
          .filter((id) => id > 0);

        const articlePayload: CreateArticleReq | UpdateArticleReq = {
          title: articleData.title,
          content: articleData.content,
          summary: articleData.excerpt,
          cover_image: articleData.coverImage,
          status: 'draft',
          access_type: 'public',
          is_original: 1,
          is_top: 0,
          category_id: categoryId,
          tag_ids: tagIds,
        };

        if (currentArticleId) {
          // 更新现有文章
          await UpdateArticle(currentArticleId, articlePayload);
        } else {
          // 创建新文章
          const response = await CreateArticle(
            articlePayload as CreateArticleReq,
          );
          if (response.code === 0) {
            setCurrentArticleId(response.data.article_id);
          }
        }

        if (!isAutoSave) {
          message.success('草稿保存成功');
        }
      } catch (error) {
        console.error('保存草稿失败:', error);
        if (!isAutoSave) {
          message.error('保存失败，请重试');
        }
      } finally {
        setSaving(false);
      }
    },
    [articleData, categories, popularTags, currentArticleId],
  );

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
      // 查找分类ID
      const category = categories.find(
        (cat) => cat.name === articleData.category,
      );
      const categoryId = category?.id;

      if (!categoryId) {
        message.error('选择的分类不存在');
        return;
      }

      // 查找标签ID
      const tagIds = articleData.tags
        .map((tagName) => {
          const tag = popularTags.find((t) => t.name === tagName);
          return tag?.id || 0;
        })
        .filter((id) => id > 0);

      const articlePayload: CreateArticleReq | UpdateArticleReq = {
        title: articleData.title,
        content: articleData.content,
        summary: articleData.excerpt,
        cover_image: articleData.coverImage,
        status: 'published',
        access_type: 'public',
        is_original: 1,
        is_top: 0,
        category_id: categoryId,
        tag_ids: tagIds,
      };

      if (currentArticleId) {
        // 更新现有文章为发布状态
        await UpdateArticle(currentArticleId, articlePayload);
      } else {
        // 创建并发布新文章
        const response = await CreateArticle(
          articlePayload as CreateArticleReq,
        );
        if (response.code === 0) {
          setCurrentArticleId(response.data.article_id);
        }
      }

      message.success('文章发布成功！');
      history.push('/my-articles');
    } catch (error) {
      console.error('发布文章失败:', error);
      message.error('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [articleData, categories, popularTags, currentArticleId]);

  // 返回上一页
  const handleBack = useCallback(() => {
    if (
      articleData.title ||
      articleData.content !== '# 开始写作\n\n在这里开始你的创作...'
    ) {
      Modal.confirm({
        title: '确认离开？',
        content: '您有未保存的更改，确定要离开吗？',
        onOk: () => history.back(),
      });
    } else {
      history.back();
    }
  }, [articleData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div {...scaleIn} className="text-center">
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
            onTitleChange={(title: string) =>
              setArticleData((prev) => ({ ...prev, title }))
            }
            onExcerptChange={(excerpt: string) =>
              setArticleData((prev) => ({ ...prev, excerpt }))
            }
            onContentChange={handleContentChange}
          />

          {/* 侧边栏 */}
          <WriteSidebar
            articleData={{
              category: articleData.category,
              isDraft: articleData.isDraft,
              tags: articleData.tags,
              coverImage: articleData.coverImage,
            }}
            newTag={newTag}
            categories={categories.map((cat) => cat.name)}
            popularTags={popularTags.map((tag) => tag.name)}
            onDataChange={(data: Partial<ArticleData>) =>
              setArticleData((prev) => ({ ...prev, ...data }))
            }
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
