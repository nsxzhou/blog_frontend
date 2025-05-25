import { ComponentType } from 'react';

// 定义具有 layout 属性的组件类型
export type LayoutComponent<P = {}> = ComponentType<P> & {
  layout?: ComponentType<any>;
};

// 帮助函数，用于设置组件的 layout 属性
export function withLayout<P>(
  Component: ComponentType<P>, 
  Layout: ComponentType<any>
): LayoutComponent<P> {
  const WrappedComponent = Component as LayoutComponent<P>;
  WrappedComponent.layout = Layout;
  return WrappedComponent;
} 