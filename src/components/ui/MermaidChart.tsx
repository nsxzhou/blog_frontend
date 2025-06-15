import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/constants/animations';

interface MermaidChartProps {
    chart: string;
    className?: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, className = '' }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderChart = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 动态导入 mermaid
                const mermaid = (await import('mermaid')).default;

                // 配置 mermaid
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: 14,
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                        curve: 'basis',
                        padding: 30,
                        nodeSpacing: 60,
                        rankSpacing: 60,
                        diagramPadding: 30,
                    },
                    themeVariables: {
                        primaryColor: '#f9fafb',
                        primaryTextColor: '#374151',
                        primaryBorderColor: '#d1d5db',
                        lineColor: '#6b7280',
                        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '14px',
                    }
                });

                if (elementRef.current) {
                    elementRef.current.innerHTML = '';
                    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    elementRef.current.innerHTML = svg;

                    const svgElement = elementRef.current.querySelector('svg');
                    if (svgElement) {
                        // 获取原始尺寸
                        const originalWidth = svgElement.getAttribute('width');
                        const originalHeight = svgElement.getAttribute('height');

                        // 移除原始的宽高属性
                        svgElement.removeAttribute('width');
                        svgElement.removeAttribute('height');

                        // 设置统一的样式
                        svgElement.style.width = '100%';
                        svgElement.style.height = 'auto';
                        svgElement.style.display = 'block';
                        svgElement.style.margin = '0 auto';

                        // 修复 viewBox 问题
                        let viewBox = svgElement.getAttribute('viewBox');
                        if (!viewBox && originalWidth && originalHeight) {
                            // 如果没有 viewBox，根据原始尺寸创建
                            viewBox = `0 0 ${originalWidth} ${originalHeight}`;
                            svgElement.setAttribute('viewBox', viewBox);
                        } else if (viewBox) {
                            // 如果有 viewBox，确保有足够的边距
                            const [x, y, width, height] = viewBox.split(' ').map(Number);
                            const padding = 20;
                            const newViewBox = `${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}`;
                            svgElement.setAttribute('viewBox', newViewBox);
                        } else {
                            // 最后的备选方案：使用 getBBox
                            try {
                                const bbox = svgElement.getBBox();
                                const padding = 20;
                                const newViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
                                svgElement.setAttribute('viewBox', newViewBox);
                            } catch (e) {
                                console.warn('无法获取 SVG bbox:', e);
                            }
                        }

                        // 确保 SVG 有正确的 preserveAspectRatio
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        // 直接应用样式
                        setTimeout(() => {
                            applyUniformStyles(svgElement);
                        }, 50);
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('图表渲染失败');
                setIsLoading(false);
            }
        };

        if (chart && chart.trim()) {
            renderChart();
        }
    }, [chart]);

    const applyUniformStyles = (svgElement: SVGSVGElement) => {
        // 统一文本样式
        const textElements = svgElement.querySelectorAll('text');
        textElements.forEach((text) => {
            text.style.fontSize = '14px';
            text.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
            text.style.fill = '#374151';
        });

        // 统一节点样式
        const rectElements = svgElement.querySelectorAll('rect');
        rectElements.forEach((rect) => {
            const width = parseFloat(rect.getAttribute('width') || '0'  );
            const height = parseFloat(rect.getAttribute('height') || '0');

            if (width > 0 && width < 80) rect.setAttribute('width', '80');
            if (height > 0 && height < 40) rect.setAttribute('height', '40');

            rect.style.fill = '#f9fafb';
            rect.style.stroke = '#d1d5db';
            rect.style.strokeWidth = '1.5px';
        });

        // 统一圆形节点
        const circleElements = svgElement.querySelectorAll('circle');
        circleElements.forEach((circle) => {
            const radius = parseFloat(circle.getAttribute('r') || '0');
            if (radius > 0 && radius < 25) circle.setAttribute('r', '25');

            circle.style.fill = '#f9fafb';
            circle.style.stroke = '#d1d5db';
            circle.style.strokeWidth = '1.5px';
        });

        // 统一连线
        const pathElements = svgElement.querySelectorAll('path');
        pathElements.forEach((path) => {
            if (path.getAttribute('stroke') && path.getAttribute('stroke') !== 'none') {
                path.style.stroke = '#6b7280';
                path.style.strokeWidth = '1.5px';
            }
        });

        // 重新计算并调整 viewBox 以确保所有内容可见
        try {
            const bbox = svgElement.getBBox();
            const padding = 30;
            const newViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
            svgElement.setAttribute('viewBox', newViewBox);
        } catch (e) {
            console.warn('无法重新计算 viewBox:', e);
        }
    };

    if (error) {
        return (
            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className={`my-6 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
            >
                <div className="text-red-600 text-center">
                    <span className="text-sm">⚠️ {error}</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className={`my-6 ${className}`}
        >
            {isLoading && (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        <span className="text-sm">正在渲染图表...</span>
                    </div>
                </div>
            )}
            <div
                ref={elementRef}
                className="mermaid-chart bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-visible"
                style={{
                    minHeight: isLoading ? '0' : 'auto',
                    maxWidth: '100%',
                    width: '100%',
                    display: isLoading ? 'none' : 'block'
                }}
            />
        </motion.div>
    );
};

export default MermaidChart; 