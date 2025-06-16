# 路由守卫系统重新设计

## 改进概述

我已经重新设计了项目的路由守卫系统，使其更加简洁明了、类型安全且易于维护。

## 主要改进

### 1. 类型安全的权限枚举

**之前**: 使用字符串常量，容易出错
```typescript
// 旧的方式
requiredRole="canAccess"
requiredRole="isAdmin" 
requiredRole="shouldNotAccess"
```

**现在**: 使用 TypeScript 枚举，提供类型安全
```typescript
// 新的方式
export enum RoutePermission {
  PUBLIC = 'public',           // 公开页面，无需登录
  AUTH_REQUIRED = 'auth',      // 需要登录
  ADMIN_ONLY = 'admin',        // 仅管理员
  GUEST_ONLY = 'guest',        // 仅未登录用户（如登录页）
}
```

### 2. 清晰的权限配置

**之前**: 权限配置分散且不直观
```typescript
export const routeAccessMap: Record<string, string> = {
  '/profile': 'canAccess',
  '/write': 'isAdmin',
  '/login': 'shouldNotAccess',
};
```

**现在**: 结构化的配置，支持更多选项
```typescript
export const routeConfigMap: Record<string, RouteConfig> = {
  '/profile': { permission: RoutePermission.AUTH_REQUIRED },
  '/write': { permission: RoutePermission.ADMIN_ONLY },
  '/login': { permission: RoutePermission.GUEST_ONLY },
};
```

### 3. 简化的组件接口

**之前**: 复杂的 props 接口
```typescript
interface ProtectedRouteProps {
  requiredRole?: string;
  customCheck?: (user: any) => boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}
```

**现在**: 更清晰的接口
```typescript
interface ProtectedRouteProps {
  permission?: RoutePermission;
  customCheck?: (user: any) => boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}
```

### 4. 专门的权限检查工具

新增了 `PermissionChecker` 类，提供统一的权限检查逻辑：

```typescript
export class PermissionChecker {
  static checkPermission(
    permission: RoutePermission,
    user: UserInfo | null,
    isLoggedIn: boolean,
    customRedirectTo?: string
  ): PermissionCheckResult;
  
  static isAdmin(user: UserInfo | null): boolean;
  static hasRole(user: UserInfo | null, role: string): boolean;
}
```

### 5. 便捷的 Hook

新增 `usePermission` Hook，方便在组件中进行权限检查：

```typescript
const { 
  hasPermission, 
  isAdmin, 
  hasRole, 
  isAuthenticated,
  checkPermission 
} = usePermission();
```

### 6. 权限包装组件

新增 `PermissionWrapper` 组件，用于条件渲染：

```tsx
<PermissionWrapper permission={RoutePermission.ADMIN_ONLY}>
  <AdminButton />
</PermissionWrapper>

<PermissionWrapper requireAuth fallback={<LoginPrompt />}>
  <UserContent />
</PermissionWrapper>
```

## 文件结构

```
src/
├── components/
│   ├── ProtectedRoute.tsx          # 重新设计的路由守卫组件
│   └── PermissionWrapper.tsx       # 新增：权限包装组件
├── hooks/
│   └── usePermission.ts            # 新增：权限检查 Hook
├── utils/
│   ├── routeAccess.ts              # 重构：路由权限配置
│   └── permission.ts               # 新增：权限检查工具
└── pages/
    └── permission-test/            # 新增：权限测试页面
        └── index.tsx
```

## 使用示例

### 基本路由保护

```tsx
// 自动从路由配置获取权限
<ProtectedRoute permission={RoutePermission.AUTH_REQUIRED}>
  <UserProfile />
</ProtectedRoute>
```

### 组件级权限控制

```tsx
function Header() {
  return (
    <div>
      <PermissionWrapper requireAuth>
        <UserMenu />
      </PermissionWrapper>
      
      <PermissionWrapper requireAdmin>
        <AdminPanel />
      </PermissionWrapper>
    </div>
  );
}
```

### Hook 使用

```tsx
function MyComponent() {
  const { isAdmin, hasPermission } = usePermission();
  
  if (!hasPermission(RoutePermission.AUTH_REQUIRED)) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      {isAdmin() && <AdminFeatures />}
    </div>
  );
}
```

## 测试

访问 `/permission-test` 页面可以测试各种权限场景，包括：
- 公开内容显示
- 登录要求检查
- 管理员权限验证
- 自定义权限逻辑

## 迁移指南

1. 将 `requiredRole` 替换为 `permission`
2. 使用 `RoutePermission` 枚举替代字符串
3. 更新路由配置使用新的 `routeConfigMap`
4. 利用新的 Hook 和组件简化权限检查逻辑

## 优势

1. **类型安全**: TypeScript 枚举防止拼写错误
2. **可维护性**: 集中的配置和清晰的结构
3. **可扩展性**: 易于添加新的权限类型
4. **开发体验**: 更好的 IDE 支持和自动补全
5. **测试友好**: 独立的权限检查逻辑便于单元测试
6. **性能优化**: 减少不必要的重新渲染

这个新的路由守卫系统提供了更好的开发体验，同时保持了灵活性和可扩展性。
