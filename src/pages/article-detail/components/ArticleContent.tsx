import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import {
    contentVariants,
    itemVariants,
    fadeInUp,
} from '@/constants/animations';

interface ArticleContentProps {
    content: string;
    onContentLoaded?: () => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
    content,
    onContentLoaded,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onContentLoaded) {
            onContentLoaded();
        }
    }, [content, onContentLoaded]);

    // 自定义组件映射
    const components = {
        // 代码块
        code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="my-6"
                >
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg shadow-lg"
                        showLineNumbers
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </motion.div>
            ) : (
                <code
                    className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                >
                    {children}
                </code>
            );
        },

        // 标题
        h1: ({ children }: any) => (
            <motion.h1
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200"
            >
                {children}
            </motion.h1>
        ),
        h2: ({ children }: any) => (
            <motion.h2
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-2xl font-semibold text-gray-900 mt-8 mb-4"
            >
                {children}
            </motion.h2>
        ),
        h3: ({ children }: any) => (
            <motion.h3
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-xl font-semibold text-gray-900 mt-6 mb-3"
            >
                {children}
            </motion.h3>
        ),

        // 段落
        p: ({ children }: any) => (
            <motion.p
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-gray-700 leading-7 mb-4"
            >
                {children}
            </motion.p>
        ),

        // 列表
        ul: ({ children }: any) => (
            <motion.ul
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4"
            >
                {children}
            </motion.ul>
        ),
        ol: ({ children }: any) => (
            <motion.ol
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="list-decimal list-inside text-gray-700 mb-4 space-y-1 ml-4"
            >
                {children}
            </motion.ol>
        ),

        // 图片
        img: ({ src, alt }: any) => (
            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="my-6"
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full rounded-lg shadow-lg"
                    loading="lazy"
                />
                {alt && (
                    <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>
                )}
            </motion.div>
        ),

        // 引用
        blockquote: ({ children }: any) => (
            <motion.blockquote
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700"
            >
                {children}
            </motion.blockquote>
        ),

        // 表格
        table: ({ children }: any) => (
            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="my-6 overflow-x-auto"
            >
                <table className="min-w-full border-collapse bg-white rounded-lg shadow-sm">
                    {children}
                </table>
            </motion.div>
        ),
        th: ({ children }: any) => (
            <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900">
                {children}
            </th>
        ),
        td: ({ children }: any) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700">
                {children}
            </td>
        ),

        // 链接
        a: ({ href, children }: any) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors"
            >
                {children}
            </a>
        ),

        // 水平线
        hr: () => (
            <motion.hr
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="my-8 border-0 h-px bg-gray-200"
            />
        ),
    };

    return (
        <motion.article
            ref={contentRef}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="max-w-5xl mx-auto px-4"
        >
            <motion.div
                variants={itemVariants}
                className="prose prose-lg max-w-none"
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                >
                    {content}
                </ReactMarkdown>
            </motion.div>

            {/* 文章结束标识 */}
            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="flex items-center justify-center mt-12 mb-8"
            >
                <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-8 h-px bg-gray-300"></div>
                    <span className="text-sm font-medium">文章结束</span>
                    <div className="w-8 h-px bg-gray-300"></div>
                </div>
            </motion.div>
        </motion.article>
    );
};

export default ArticleContent; 