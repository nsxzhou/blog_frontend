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
      <div className="px-4 py-1.5 bg-blue-500 text-white rounded-full font-medium">
        {article.category}
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
    const element = document.querySelector(href);
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

      // 移除标题中的内联代码和链接
      const cleanTitle = title
        .replace(/`[^`]+`/g, '') // 移除内联代码
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 提取链接文本
        .replace(/[!@#$%^&*()]/g, '') // 移除特殊字符
        .trim();

      // 生成与 rehype-slug 兼容的 ID
      const key = cleanTitle
        .toLowerCase()
        .replace(/[\s,.]+/g, '-') // 将空格和标点转换为连字符
        .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '') // 保留数字、字母、中文和连字符
        .replace(/^-+|-+$/g, '') // 移除首尾连字符
        .replace(/-+/g, '-'); // 将多个连字符合并为一个

      if (key) {
        headings.push({
          key,
          href: `#${key}`,
          title: cleanTitle,
          level,
        });
      }
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
        commentList({ article_id: id }),
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

  // 优化标题观察器
  useEffect(() => {
    if (!article) return;

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

    const headings = document.querySelectorAll(
      ".markdown-content h1, .markdown-content h2, .markdown-content h3"
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [article]);

  if (loading) return <LoadingState />;
  if (!article)
    return (
      <Empty
        className="min-h-[80vh] flex justify-center items-center"
        description="文章不存在"
      />
    );

  const headings = extractHeadings(article.content);

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
