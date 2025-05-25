import '@umijs/max/typings';

// 扩展 React 组件类型，支持 layout 属性
declare namespace React {
  interface FunctionComponent<P = {}> {
    layout?: React.ComponentType;
  }
}
