import { articleDetail, articleType } from "@/api/article";
import { commentList, commentType } from "@/api/comment";
import { formatDate } from "@/utils/date";
import {
  ClockCircleOutlined,
  CommentOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Col, Empty, FloatButton, message, Row, Spin } from "antd";
import "highlight.js/styles/github.css";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CommentArea } from "../comment/comment";
import { ArticleSearch } from "../search/articlesearch";
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';

interface HeadingType {
  key: string;
  href: string;
  title: string;
  level: number;
}

// 3. 抽取文章头部组件
const ArticleHeader = ({ article }: { article: articleType }) => (
  <div className="bg-white rounded-t-lg overflow-hidden">
    {/* 标题区域 */}
    <div className="px-8 pt-8 pb-6">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        {article.title}
      </h1>
    </div>

    {/* 元信息区域 */}
    <div className="px-8 pb-6 flex flex-wrap items-center gap-6">
      {/* 分类标签 */}
      <div className="flex gap-2">
        {Array.isArray(article.category) ? (
          article.category.map((cat, index) => (
            <div
              key={index}
              className="px-4 py-1.5 bg-blue-500 text-white rounded-full font-medium"
            >
              {cat}
            </div>
          ))
        ) : (
          <div className="px-4 py-1.5 bg-blue-500 text-white rounded-full font-medium">
            {article.category}
          </div>
        )}
      </div>

      {/* 时间信息 */}
      <div className="flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-gray-400" />
          <span>发布于 {formatDate(article.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <EditOutlined className="text-gray-400" />
          <span>更新于 {formatDate(article.updated_at)}</span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex gap-4 ml-auto">
        <MetricBadge
          icon={<EyeOutlined className="text-blue-500" />}
          count={article.look_count}
          text="阅读"
        />
        <MetricBadge
          icon={<CommentOutlined className="text-green-500" />}
          count={article.comment_count}
          text="评论"
        />
      </div>
    </div>

    {/* 分隔线 */}
    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
  </div>
);

// 优化指标徽章组件
const MetricBadge = ({
  icon,
  count,
  text,
}: {
  icon: React.ReactNode;
  count: number;
  text: string;
}) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                  bg-gray-50 hover:bg-gray-100 transition-colors">
    {icon}
    <span className="font-medium text-gray-700">{count.toLocaleString()}</span>
    <span className="text-gray-500">{text}</span>
  </div>
);

// 新增目录组件
const TableOfContents = React.memo(({
  headings,
  activeHeading
}: {
  headings: HeadingType[];
  activeHeading: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="border-2 border-gray-200 bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b-2 border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">文章目录</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? '展开' : '收起'}
        </button>
      </div>
      {!isCollapsed && (
        <nav className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-1">
            {headings.map((heading) => (
              <TableOfContentsItem
                key={heading.key}
                heading={heading}
                active={activeHeading === heading.key}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
});

// 优化目录项组件
const TableOfContentsItem = ({
  heading,
  active,
}: {
  heading: HeadingType;
  active: boolean;
}) => {
  const scrollToHeading = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const elementId = href.substring(1); // 移除前面的#符号
    const element = document.getElementById(elementId);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY;
      const offsetTop = 100;

      window.scrollTo({
        top: offsetPosition - offsetTop,
        behavior: "smooth",
      });

      // 更新 URL，但不触发页面跳转
      window.history.pushState(null, "", href);
    } else {
      console.error(`找不到ID为 ${elementId} 的元素`);
    }
  };

  return (
    <a
      href={heading.href}
      onClick={(e) => scrollToHeading(e, heading.href)}
      className={`
        block py-2 px-4 rounded-md transition-all duration-200 cursor-pointer
        ${active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}
        ${heading.level === 1 ? 'font-medium text-base' : ''}
        ${heading.level === 2 ? 'ml-4 text-[15px]' : ''}
        ${heading.level === 3 ? 'ml-8 text-[14px] text-gray-500' : ''}
        ${heading.level >= 4 ? 'ml-12 text-[13px] text-gray-500' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <span
          className={`
            inline-block w-2 h-2 rounded-full shrink-0
            ${active ? 'bg-blue-500' : 'bg-gray-300'}
            ${heading.level === 1 ? 'w-2 h-2' : ''}
            ${heading.level === 2 ? 'w-1.5 h-1.5' : ''}
            ${heading.level >= 3 ? 'w-1 h-1' : ''}
          `}
        />
        <span className="truncate">{heading.title}</span>
      </div>
    </a>
  );
};

// 从 markdown 内容中提取标题并生成目录结构
const extractHeadings = (content: string) => {
  const lines = content.split("\n");
  const headings: HeadingType[] = [];
  let isInCodeBlock = false;
  let isInFrontMatter = false;
  const titleCounts = new Map<string, number>();

  lines.forEach((line) => {
    // 处理 frontmatter
    if (line.trim() === '---') {
      isInFrontMatter = !isInFrontMatter;
      return;
    }
    if (isInFrontMatter) return;

    // 处理代码块
    if (line.trim().startsWith("```")) {
      isInCodeBlock = !isInCodeBlock;
      return;
    }
    if (isInCodeBlock) return;

    // 匹配标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      // 将原始标题文本保存，保留原始格式，用于展示
      const displayTitle = title
        .replace(/`[^`]+`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[!@#$%^&*()]/g, '')
        .trim();

      // 为了生成ID，复制一份标题文本用于处理（这是关键）
      let idText = displayTitle;
      
      // 1. 先移除所有标记格式
      idText = idText
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
        .replace(/\*(.*?)\*/g, '$1')     // 移除斜体
        .replace(/__(.*?)__/g, '$1')     // 移除下划线粗体
        .replace(/_(.*?)_/g, '$1')       // 移除下划线斜体
        .replace(/~~(.*?)~~/g, '$1')     // 移除删除线
        .replace(/`(.*?)`/g, '$1');      // 移除代码

      // 2. 移除标题开头的数字前缀（比如 "1." 或 "1.2.3."）
      idText = idText.replace(/^[\d.]+\s*/, '');

      // 3. 转换为小写并替换非字母数字字符为连字符
      let baseKey = idText
        .toLowerCase()
        .replace(/[^\w\- ]/g, '') // 移除特殊字符
        .replace(/\s+/g, '-')     // 空格替换为连字符
        .replace(/-+/g, '-')      // 多个连字符替换为单个
        .replace(/^-+|-+$/g, ''); // 移除首尾连字符

      // 4. 如果生成的key为空，使用默认值
      if (!baseKey) {
        baseKey = 'section';
      }

      // 5. 处理重复标题
      const count = titleCounts.get(baseKey) || 0;
      titleCounts.set(baseKey, count + 1);

      // 6. 如果是重复标题，添加数字后缀
      const key = count > 0 ? `${baseKey}-${count}` : baseKey;

      headings.push({
        key,
        href: `#${key}`,
        title: displayTitle,
        level,
      });
    }
  });

  return headings;
};

// 替换 MarkdownViewer 组件
const MarkdownViewer = React.memo(({ content }: { content: string }) => {
  return (
    <div className="px-8 py-6">
      <MarkdownPreview
        source={content}
        wrapperElement={{
          "data-color-mode": "light"
        }}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { detect: true }]
        ]}
        className="markdown-content"
      />
    </div>
  );
});

// 返回顶部按钮组件
const BackToTop = () => {
  return (
    <FloatButton.BackTop
      visibilityHeight={100}
      className="!fixed !bottom-8 !right-8"
      type="primary"
    />
  );
};

// 修改加载状态组件
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spin size="large"></Spin>
  </div>
);

// 文章详情页主组件优化
export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<articleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<commentType[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  // 新增一个state来存储修正后的headings
  const [headings, setHeadings] = useState<HeadingType[]>([]);

  // 添加请求状态标记，避免重复请求
  const fetchData = useCallback(async () => {
    if (!id) {
      message.error("文章ID不存在");
      return;
    }

    if (article) return;

    try {
      setLoading(true);
      const [articleRes, commentsRes] = await Promise.all([
        articleDetail(id),
        commentList({ article_id: id, }),
      ]);

      if (articleRes.code === 0) {
        setArticle(articleRes.data);
      } else {
        throw new Error(articleRes.message);
      }

      if (commentsRes.code === 0) {
        setComments(commentsRes.data);
      } else {
        throw new Error(commentsRes.message);
      }
    } catch (error) {
      message.error(`加载失败: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [id, article]); // 添加 article 作为依赖项

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await commentList({ article_id: id });
      if (res.code === 0) {
        setComments(res.data);
      }
    } catch (error) {
      message.error("获取评论失败");
    }
  }, [id]);

  // 优化副作用处理
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 优化标题观察器，并且添加ID映射逻辑
  useEffect(() => {
    if (!article) return;

    // 先提取预期的headings
    const extractedHeadings = extractHeadings(article.content);
    
    // 等DOM渲染完成后
    setTimeout(() => {
      // 获取实际的标题元素
      const actualHeadings = document.querySelectorAll(
        ".markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6"
      );
      
      // 创建一个修正后的headings数组
      const correctedHeadings: HeadingType[] = [];
      
      // 遍历实际的标题元素
      actualHeadings.forEach((element, index) => {
        const headingText = element.textContent || "";
        // 获取实际的ID
        const actualId = element.id;
        
        // 尝试找到对应的预期heading
        let matchingHeading = extractedHeadings.find(h => 
          h.title.trim() === headingText.trim() ||
          // 处理可能的数字前缀情况
          headingText.trim().endsWith(h.title.trim())
        );
        
        if (matchingHeading) {
          // 使用实际ID更新heading
          correctedHeadings.push({
            ...matchingHeading,
            key: actualId,
            href: `#${actualId}`
          });
        } else if (actualId) {
          // 如果没找到匹配但有ID，创建一个新的heading
          correctedHeadings.push({
            key: actualId,
            href: `#${actualId}`,
            title: headingText,
            level: parseInt(element.tagName.substring(1), 10) // 从h1, h2等获取级别
          });
        }
      });
      
      // 更新headings
      setHeadings(correctedHeadings);
      
      // 设置观察器
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5,
        rootMargin: "-70px 0px -70px 0px",
      });

      actualHeadings.forEach((heading) => observer.observe(heading));

      return () => observer.disconnect();
    }, 500); // 给DOM渲染一些时间
  }, [article]);

  if (loading) return <LoadingState />;
  if (!article)
    return (
      <Empty
        className="min-h-[80vh] flex justify-center items-center"
        description="文章不存在"
      />
    );

  return (
    <div className="flex justify-center w-full bg-gray-50 py-8">
      <div className="max-w-[1500px] w-full px-4">
        <Row gutter={24}>
          <Col span={18}>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ArticleHeader article={article} />
              <div className="border-x-2 border-gray-200">
                <MarkdownViewer content={article.content} />
              </div>
              <div className="border-2 border-gray-200 rounded-b-lg">
                <CommentArea
                  comments={comments}
                  onCommentSuccess={fetchComments}
                  articleId={id}
                />
              </div>
            </div>
            <BackToTop />
          </Col>

          <Col
            span={6}
            className="sticky top-4"
            style={{ height: "fit-content" }}>
            <div className="border-2 border-gray-200 bg-white shadow-sm rounded-lg mb-4">
              <ArticleSearch />
            </div>
            <TableOfContents headings={headings} activeHeading={activeHeading} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
