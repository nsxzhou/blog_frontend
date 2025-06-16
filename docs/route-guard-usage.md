# 路由守卫使用指南

## 概述

新的路由守卫系统采用了更简洁明了的设计，提供了类型安全的权限管理和灵活的配置选项。

## 权限类型

```typescript
export enum RoutePermission {
  PUBLIC = 'public',           // 公开页面，无需登录
  AUTH_REQUIRED = 'auth',      // 需要登录
  ADMIN_ONLY = 'admin',        // 仅管理员
  GUEST_ONLY = 'guest',        // 仅未登录用户（如登录页）
}
```

## 路由配置

在 `src/utils/routeAccess.ts` 中配置路由权限：

```typescript
export const routeConfigMap: Record<string, RouteConfig> = {
  // 公开页面
  '/': { permission: RoutePermission.PUBLIC },
  '/blog': { permission: RoutePermission.PUBLIC },
  
  // 需要登录的页面
  '/profile': { permission: RoutePermission.AUTH_REQUIRED },
  '/notifications': { permission: RoutePermission.AUTH_REQUIRED },
  
  // 管理员页面
  '/write': { permission: RoutePermission.ADMIN_ONLY },
  '/users': { permission: RoutePermission.ADMIN_ONLY },
  
  // 仅未登录用户可访问
  '/login': { permission: RoutePermission.GUEST_ONLY },
};
```

## 组件使用

### 1. ProtectedRoute 组件

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';
import { RoutePermission } from '@/utils/routeAccess';

// 基本使用
<ProtectedRoute permission={RoutePermission.AUTH_REQUIRED}>
  <YourComponent />
</ProtectedRoute>

// 自定义重定向
<ProtectedRoute 
  permission={RoutePermission.ADMIN_ONLY}
  redirectTo="/custom-login"
>
  <AdminComponent />
</ProtectedRoute>

// 自定义无权限页面
<ProtectedRoute 
  permission={RoutePermission.ADMIN_ONLY}
  fallback={<CustomNoPermissionPage />}
>
  <AdminComponent />
</ProtectedRoute>

// 自定义权限检查
<ProtectedRoute 
  customCheck={({ currentUser, isLoggedIn }) => {
    return isLoggedIn && currentUser?.status === 'active';
  }}
>
  <YourComponent />
</ProtectedRoute>
```

### 2. PermissionWrapper 组件

用于在JSX中进行条件渲染：

```tsx
import PermissionWrapper from '@/components/PermissionWrapper';
import { RoutePermission } from '@/utils/routeAccess';

// 权限检查
<PermissionWrapper permission={RoutePermission.ADMIN_ONLY}>
  <AdminButton />
</PermissionWrapper>

// 需要登录
<PermissionWrapper requireAuth>
  <UserMenu />
</PermissionWrapper>

// 需要管理员权限
<PermissionWrapper requireAdmin>
  <AdminPanel />
</PermissionWrapper>

// 角色检查
<PermissionWrapper role="editor">
  <EditButton />
</PermissionWrapper>

// 自定义检查
<PermissionWrapper 
  customCheck={(user, isLoggedIn) => user?.vip === true}
  fallback={<VipUpgradeButton />}
>
  <VipFeature />
</PermissionWrapper>
```

### 3. usePermission Hook

在组件中进行权限检查：

```tsx
import { usePermission } from '@/hooks/usePermission';
import { RoutePermission } from '@/utils/routeAccess';

function MyComponent() {
  const { 
    hasPermission, 
    isAdmin, 
    hasRole, 
    isAuthenticated,
    checkPermission 
  } = usePermission();

  // 检查权限
  if (!hasPermission(RoutePermission.AUTH_REQUIRED)) {
    return <LoginPrompt />;
  }

  // 检查是否为管理员
  const showAdminFeatures = isAdmin();

  // 检查特定角色
  const canEdit = hasRole('editor');

  // 获取详细权限信息
  const permissionResult = checkPermission(RoutePermission.ADMIN_ONLY);
  
  return (
    <div>
      {showAdminFeatures && <AdminPanel />}
      {canEdit && <EditButton />}
      {!permissionResult.hasPermission && (
        <div>{permissionResult.reason}</div>
      )}
    </div>
  );
}
```

## 权限检查工具

### PermissionChecker 类

```typescript
import { PermissionChecker } from '@/utils/permission';
import { RoutePermission } from '@/utils/routeAccess';

// 检查权限
const result = PermissionChecker.checkPermission(
  RoutePermission.ADMIN_ONLY,
  currentUser,
  isLoggedIn,
  '/custom-login'
);

// 检查是否为管理员
const isAdminUser = PermissionChecker.isAdmin(currentUser);

// 检查特定角色
const hasEditorRole = PermissionChecker.hasRole(currentUser, 'editor');
```

## 最佳实践

1. **优先使用枚举**: 使用 `RoutePermission` 枚举而不是字符串
2. **集中配置**: 在 `routeConfigMap` 中集中管理路由权限
3. **组件级权限**: 使用 `PermissionWrapper` 进行细粒度的权限控制
4. **Hook 使用**: 在复杂逻辑中使用 `usePermission` Hook
5. **自定义检查**: 对于复杂的权限逻辑，使用 `customCheck` 函数

## 迁移指南

从旧的路由守卫迁移：

```typescript
// 旧的方式
<ProtectedRoute requiredRole="canAccess">
  <Component />
</ProtectedRoute>

// 新的方式
<ProtectedRoute permission={RoutePermission.AUTH_REQUIRED}>
  <Component />
</ProtectedRoute>

// 旧的方式
<ProtectedRoute requiredRole="isAdmin">
  <Component />
</ProtectedRoute>

// 新的方式
<ProtectedRoute permission={RoutePermission.ADMIN_ONLY}>
  <Component />
</ProtectedRoute>

// 旧的方式
<ProtectedRoute requiredRole="shouldNotAccess">
  <Component />
</ProtectedRoute>

// 新的方式
<ProtectedRoute permission={RoutePermission.GUEST_ONLY}>
  <Component />
</ProtectedRoute>
```
