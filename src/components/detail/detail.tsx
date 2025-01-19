import { articleDetail, articleType } from "@/api/article";
import { commentList, commentType } from "@/api/comment";
import { formatDate } from "@/utils/date";
import {
  ClockCircleOutlined,
  CommentOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { BackTop, Col, Empty, message, Row, Spin } from "antd";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import React, { useCallback, useEffect, useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useParams } from "react-router-dom";
import { CommentArea } from "../comment/comment";
import { ArticleSearch } from "../search/articlesearch";

interface HeadingType {
  key: string;
  href: string;
  title: string;
  level: number;
}

// 2. 修改 Markdown 解析器配置
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    try {
      return hljs.highlight(str, { language: lang }).value;
    } catch (__) {
      return "";
    }
  },
}).use(anchor, {
  permalink: true,
  permalinkBefore: true,
  permalinkSymbol: "",
  slugify: (s: string) =>
    `heading-${s
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "")}`,
});

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

// 5. 抽取目录项组件
const TableOfContentsItem = ({
  heading,
  active,
}: {
  heading: HeadingType;
  active: boolean;
}) => (
  <a
    href={heading.href}
    onClick={(e) => {
      e.preventDefault();
      const element = document.querySelector(heading.href);
      if (element) {
        // 获取元素的位置
        const elementPosition = element.getBoundingClientRect().top;
        // 添加页面当前滚动位置
        const offsetPosition = elementPosition + window.scrollY;
        const offsetTop = 100;

        window.scrollTo({
          top: offsetPosition - offsetTop,
          behavior: "smooth",
        });

        window.history.pushState(null, "", heading.href);
      }
    }}
    className={`
      block py-2 px-4 transition-all duration-200 cursor-pointer
      ${heading.level === 1 ? "text-base font-medium" : ""}
      ${heading.level === 2 ? "pl-8 text-[15px]" : ""}
      ${heading.level === 3 ? "pl-12 text-[14px] text-gray-500" : ""}
      ${heading.level >= 4 ? "pl-16 text-[13px] text-gray-500" : ""}
      ${active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}
    `}>
    <span className="flex items-center gap-2">
      <span
        className={`
        inline-block w-1.5 h-1.5 rounded-full
        ${heading.level === 1 ? "bg-blue-500" : ""}
        ${heading.level === 2 ? "bg-blue-400" : ""}
        ${heading.level === 3 ? "bg-gray-400" : ""}
        ${heading.level >= 4 ? "bg-gray-300" : ""}
      `}
      />
      {heading.title}
    </span>
  </a>
);

// 从 markdown 内容中提取标题并生成目录结构
const extractHeadings = (content: string) => {
  const lines = content.split("\n");
  const headings = lines
    .filter((line) => line.startsWith("#"))
    .map((line) => {
      const level = line.match(/^#+/)?.[0].length || 0; // 获取标题级别
      const title = line.replace(/^#+\s*/, "").trim(); // 提取标题文本
      // 生成唯一的锚点 ID
      const key = `heading-${title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-|-$/g, "")}`;
      return { key, href: `#${key}`, title, level };
    });
  return headings;
};

// 优化 MarkdownViewer 组件，使用 memo 避免不必要的重渲染
const MarkdownViewer = React.memo(({ content }: { content: string }) => {
  return (
    <>
      <MdEditor
        value={content}
        view={{ menu: false, md: false, html: true }}
        canView={{
          menu: false,
          md: false,
          html: true,
          fullScreen: false,
          hideMenu: false,
          both: false,
        }}
        readOnly={true}
        className="border-none shadow-none pl-8"
        style={{ backgroundColor: "transparent" }}
        renderHTML={(text) => (
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}
          />
        )}
      />
    </>
  );
});

// 返回顶部按钮组件
const BackToTop = () => {
  return (
    <BackTop visibilityHeight={100}>
      <div
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 
                          text-white w-10 h-10 rounded-full flex items-center 
                          justify-center cursor-pointer shadow-lg 
                          transition-all duration-300 ease-in-out">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>
    </BackTop>
  );
};

// 添加加载状态组件
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spin size="large" tip="正在加载文章..." />
  </div>
);

// 文章详情页主组件优化
export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<articleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<commentType[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");

  // 优化数据获取逻辑
  const fetchData = useCallback(async () => {
    if (!id) {
      message.error("文章ID不存在");
      return;
    }

    try {
      setLoading(true);

      // 并行请求文章详情和评论
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
  }, [id]);

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
  if (!article) return <Empty description="文章不存在" />;

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
            {headings.length > 0 && (
              <div className="border-2 border-gray-200 bg-white shadow-sm rounded-lg">
                <h3 className="px-6 py-4 text-lg font-medium border-b-2 border-gray-200">
                  文章目录
                </h3>
                <nav className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {headings.map((heading) => (
                    <TableOfContentsItem
                      key={heading.key}
                      heading={heading}
                      active={activeHeading === heading.key}
                    />
                  ))}
                </nav>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
