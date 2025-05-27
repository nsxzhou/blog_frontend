import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from '@umijs/max';
import { Spin, Result, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  ArticleHeader,
  ArticleContent,
  TableOfContents,
  RelatedArticles,
  CommentSection,
} from './components';
import { pageVariants, containerVariants } from '@/constants/animations';
import type { Article, RelatedArticle, Comment } from './types';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tocVisible, setTocVisible] = useState(false);

  // 模拟文章数据
  const mockArticle: Article = {
    id: parseInt(id || '1'),
    title: "深入理解React 18的并发特性：从理论到实践",
    content: `# React 18 并发特性详解

React 18 带来了许多激动人心的新特性，其中最重要的就是并发特性。这些特性不仅提升了用户体验，还为开发者提供了更好的开发工具。

## 什么是并发渲染？

并发渲染是 React 18 引入的一个重要概念。它允许 React 在渲染过程中暂停、恢复或放弃渲染任务，从而保持应用的响应性。

\`\`\`javascript
// 使用 createRoot 启用并发特性
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
\`\`\`

### 主要特性

#### 1. 自动批处理 (Automatic Batching)

React 18 扩展了批处理的范围，现在在 Promise、setTimeout 和原生事件处理器中的状态更新也会被自动批处理。

\`\`\`javascript
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // React 18 会自动批处理这些更新
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
      // 只会触发一次重新渲染
    }, 1000);
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
\`\`\`

#### 2. Suspense 改进

React 18 对 Suspense 进行了重大改进，使其更加稳定和功能强大。

\`\`\`javascript
import { Suspense, lazy } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

#### 3. useTransition Hook

\`useTransition\` 允许你将某些状态更新标记为"过渡"，从而告诉 React 这些更新的优先级较低。

\`\`\`javascript
import { useState, useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  function handleChange(e) {
    setInput(e.target.value);
    
    // 将列表更新标记为过渡
    startTransition(() => {
      setList(generateList(e.target.value));
    });
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <div>Loading...</div>}
      <ul>
        {list.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

## 实际应用场景

### 大列表渲染优化

对于包含大量数据的列表，并发特性可以显著提升用户体验：

\`\`\`javascript
function BigList({ items }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    
    // 如果列表很大，使用 transition 来避免阻塞输入
    if (items.length > 1000) {
      startTransition(() => {
        setFilter(value);
      });
    }
  };

  return (
    <div>
      <input 
        value={filter} 
        onChange={handleFilterChange}
        placeholder="搜索..."
      />
      {isPending && <div>筛选中...</div>}
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

## 性能对比

让我们通过一个表格来看看 React 18 并发特性带来的性能提升：

| 特性 | React 17 | React 18 | 提升 |
|------|----------|----------|------|
| 批处理范围 | 仅事件处理器 | 所有更新 | 更少重渲染 |
| 中断能力 | 无 | 支持 | 更好响应性 |
| 优先级调度 | 基础 | 高级 | 更智能更新 |

## 最佳实践

1. **合理使用 useTransition**：只对非紧急的状态更新使用
2. **Suspense 边界**：在合适的位置设置 Suspense 边界
3. **渐进式迁移**：可以逐步将现有应用迁移到 React 18

> **注意**：并发特性是向后兼容的，现有的 React 应用可以无缝升级到 React 18。

## 总结

React 18 的并发特性代表了 React 发展的一个重要里程碑。通过引入可中断的渲染、优先级调度和改进的 Suspense，React 18 为构建高性能、响应式的用户界面提供了强大的工具。

这些特性不仅提升了用户体验，也为开发者提供了更多的控制权和灵活性。随着生态系统的不断发展，我们可以期待看到更多基于这些特性的创新应用。

---

*本文深入探讨了 React 18 的核心并发特性，希望能帮助开发者更好地理解和应用这些新功能。*`,
    excerpt: "探索React 18引入的并发渲染、Suspense边界和自动批处理等革命性特性，以及它们如何改变我们构建用户界面的方式。",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    author: {
      name: "张三",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "前端架构师，React 专家"
    },
    publishDate: "2024-01-15",
    readTime: 12,
    views: 1234,
    likes: 89,
    comments: 23,
    tags: ["React", "JavaScript", "前端", "性能优化"],
    category: "前端开发",
    featured: true
  };

  // 模拟相关文章数据
  const mockRelatedArticles: RelatedArticle[] = [
    {
      id: 2,
      title: "现代CSS布局技术详解",
      excerpt: "从Flexbox到Grid，全面了解现代CSS布局技术的最佳实践和使用场景。",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      date: "2024-01-12",
      views: 2156,
      readTime: 8,
      category: "前端开发",
      tags: ["CSS", "布局", "设计"]
    },
    {
      id: 3,
      title: "TypeScript 5.0新特性解析",
      excerpt: "TypeScript 5.0带来了哪些激动人心的新特性？深入了解最新的开发体验。",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      date: "2024-01-10",
      views: 1876,
      readTime: 10,
      category: "编程语言",
      tags: ["TypeScript", "JavaScript", "开发工具"]
    },
    {
      id: 4,
      title: "微前端架构实战指南",
      excerpt: "如何在大型项目中实施微前端架构，解决团队协作和技术栈统一的难题。",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      date: "2024-01-08",
      views: 987,
      readTime: 15,
      category: "系统架构",
      tags: ["微前端", "架构", "工程化"]
    }
  ];

  // 模拟评论数据
  const mockComments: Comment[] = [
    {
      id: 1,
      author: {
        name: "李四",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      content: "非常详细的文章！React 18的并发特性确实带来了很大的性能提升，特别是在处理大量数据时。useTransition 这个hook在我的项目中非常有用。",
      date: "2024-01-16 14:30",
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 2,
          author: {
            name: "王五",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
          },
          content: "同感！我在公司项目中也开始使用React 18了，自动批处理真的减少了很多不必要的渲染。",
          date: "2024-01-16 15:15",
          likes: 5,
          isLiked: true
        }
      ]
    },
    {
      id: 3,
      author: {
        name: "赵六",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      content: "文章写得很好，代码示例也很清晰。不过我想问一下，在什么情况下不建议使用并发特性？",
      date: "2024-01-16 16:45",
      likes: 8,
      isLiked: false
    }
  ];

  // 获取文章数据
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (id && parseInt(id) === mockArticle.id) {
          setArticle(mockArticle);
          setRelatedArticles(mockRelatedArticles);
          setComments(mockComments);
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        setError('加载文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

  // 返回按钮
  const handleBack = () => {
    history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="404"
          title="文章未找到"
          subTitle={error || "抱歉，您访问的文章不存在"}
          extra={
            <Button type="primary" onClick={handleBack}>
              返回上一页
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    >
      {/* 返回按钮 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            返回
          </Button>
        </div>
      </motion.div>

      {/* 文章头部 */}
      <ArticleHeader
        title={article.title}
        author={article.author}
        publishDate={article.publishDate}
        readTime={article.readTime}
        views={article.views}
        likes={article.likes}
        comments={article.comments}
        tags={article.tags}
        category={article.category}
        coverImage={article.coverImage}
      />

      {/* 文章内容 */}
      <ArticleContent
        content={article.content}
        onContentLoaded={() => { }}
      />

      {/* 相关文章 */}
      <RelatedArticles
        articles={relatedArticles}
        currentArticleId={article.id}
      />

      {/* 评论区 */}
      <CommentSection
        comments={comments}
        articleId={article.id}
      />

      {/* 目录导航 */}
      <TableOfContents
        isVisible={tocVisible}
        onToggle={() => setTocVisible(!tocVisible)}
      />
    </motion.div>
  );
};

export default ArticleDetailPage;
