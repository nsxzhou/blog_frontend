import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

// 定义 Stagewise 配置类型
interface StagewiseConfig {
  plugins: any[];
}

// 定义 StagewiseToolbar 组件类型
interface StagewiseToolbarProps {
  config: StagewiseConfig;
}

type StagewiseToolbarComponent = FC<StagewiseToolbarProps>;

/**
 * Stagewise 工具栏包装组件
 * 仅在开发环境中加载和显示 Stagewise 工具栏
 */
const StagewiseWrapper: FC = () => {
  const [StagewiseToolbar, setStagewiseToolbar] = useState<StagewiseToolbarComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 仅在开发环境中加载
    if (process.env.NODE_ENV !== 'development') {
      setIsLoading(false);
      return;
    }

    // 动态导入 Stagewise 工具栏
    const loadStagewise = async () => {
      try {
        const stagewiseModule = await import('@stagewise/toolbar-react');

        // 验证导入的组件是否存在
        if (stagewiseModule.StagewiseToolbar) {
          setStagewiseToolbar(() => stagewiseModule.StagewiseToolbar);
        } else {
          throw new Error('StagewiseToolbar component not found in module');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Failed to load Stagewise toolbar:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadStagewise();
  }, []);

  // 生产环境或加载中时不渲染
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // 加载中状态
  if (isLoading) {
    return null; // 静默加载，不显示加载指示器
  }

  // 错误状态
  if (error) {
    // 仅在开发环境中显示错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('Stagewise Wrapper Error:', error);
    }
    return null;
  }

  // 组件未加载成功
  if (!StagewiseToolbar) {
    return null;
  }

  // Stagewise 配置
  const stagewiseConfig: StagewiseConfig = {
    plugins: [] // 可以在这里添加插件配置
  };

  return <StagewiseToolbar config={stagewiseConfig} />;
};

export default StagewiseWrapper; 