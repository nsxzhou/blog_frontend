import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { motion } from 'framer-motion';
import ArticleHeader from './components/ArticleHeader';
import ArticleContent from './components/ArticleContent';
import ArticleSidebar from './components/ArticleSidebar';
import PageContainer from '@/components/ui/PageContainer';
import type { BlogPost } from '../blog/components/types';

// 模拟文章数据
const mockArticleData: BlogPost = {
    id: 1,
    title: "React 18 新特性详解：Concurrent Features 实战指南",
    excerpt: "深入了解 React 18 带来的并发特性，包括 Suspense、并发渲染、自动批处理等功能，以及如何在项目中应用这些新特性。",
    content: `
# React 18 新特性详解：Concurrent Features 实战指南

React 18 是 React 历史上最重要的版本之一，引入了许多令人兴奋的新特性。本文将深入探讨这些新特性，并提供实际的应用示例。

## 并发渲染 (Concurrent Rendering)

React 18 最大的亮点就是并发渲染功能。这项技术让 React 能够同时准备多个版本的 UI，从而提供更好的用户体验。

### 什么是并发渲染？

并发渲染允许 React 在渲染过程中被中断，让位给更重要的任务，然后再恢复渲染。这意味着：

- 用户交互不会被长时间的渲染阻塞
- 应用响应性大大提升
- 可以优先处理重要的更新

### 代码示例

\`\`\`jsx
import { startTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery); // 立即更新，高优先级
    
    startTransition(() => {
      // 低优先级更新，可以被中断
      setResults(searchData(newQuery));
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleSearch(e.target.value)} />
      <SearchResultsList results={results} />
    </div>
  );
}
\`\`\`

## Suspense 改进

React 18 对 Suspense 进行了重大改进，现在支持服务端渲染和并发特性。

### Suspense 的新用法

\`\`\`jsx
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ProfilePage />
      </Suspense>
    </div>
  );
}
\`\`\`

## 自动批处理 (Automatic Batching)

React 18 引入了自动批处理功能，可以将多个状态更新合并为一次重新渲染，即使这些更新发生在异步代码中。

### 示例对比

在 React 17 中：
\`\`\`jsx
// React 17: 两次渲染
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

在 React 18 中：
\`\`\`jsx
// React 18: 一次渲染（自动批处理）
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

## 新的 Hooks

React 18 还引入了几个新的 Hooks：

### useId

为服务端渲染生成唯一的 ID：

\`\`\`jsx
import { useId } from 'react';

function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <input id={id + '-firstName'} type="text" />
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <input id={id + '-lastName'} type="text" />
    </div>
  );
}
\`\`\`

### useDeferredValue

延迟更新非紧急状态：

\`\`\`jsx
import { useDeferredValue } from 'react';

function SearchPage({ query }) {
  const deferredQuery = useDeferredValue(query);
  
  return (
    <div>
      <SearchInput query={query} />
      <SearchResults query={deferredQuery} />
    </div>
  );
}
\`\`\`

## 升级建议

1. **逐步升级**：React 18 向后兼容，可以逐步升级
2. **测试充分**：重点测试并发特性相关的功能
3. **性能监控**：关注应用性能变化

## 总结

React 18 的并发特性为我们提供了构建更好用户体验的工具。通过合理使用这些新特性，我们可以：

- 提升应用响应性
- 优化渲染性能
- 改善用户体验

虽然这些特性很强大，但也要谨慎使用，确保在实际项目中进行充分测试。

---

希望这篇文章能帮助你更好地理解和应用 React 18 的新特性。如果你有任何问题，欢迎在评论区讨论！
  `,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    date: "2024-01-15",
    views: 2340,
    likes: 156,
    comments: 23,
    tags: ["React", "JavaScript", "前端开发", "React 18", "并发渲染"],
    category: "前端技术",
    author: {
        name: "张三",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    featured: true
};

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    },
    exit: { opacity: 0, y: -20 }
};

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 模拟API请求
        const timer = setTimeout(() => {
            setArticle(mockArticleData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                </div>
            </PageContainer>
        );
    }

    if (!article) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
                    <button
                        onClick={() => history.push('/blog')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        返回博客列表
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto"
            >
                {/* 文章头部 */}
                <ArticleHeader article={article} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    {/* 主要内容区域 */}
                    <div className="lg:col-span-3">
                        <ArticleContent article={article} />
                    </div>

                    {/* 侧边栏 */}
                    <div className="lg:col-span-1">
                        <ArticleSidebar article={article} />
                    </div>
                </div>
            </motion.div>
        </PageContainer>
    );
};

export default ArticleDetailPage;