import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  CreateCategoryReq,
  CreateCategoryRes,
  GetCategoryDetailRes,
  GetCategoryListReq,
  GetCategoryListRes,
  UpdateCategoryReq,
  GetHotCategoryRes,
  UpdateCategoryRes,
} from './type';

// 创建分类
export function CreateCategory(data: CreateCategoryReq) {
  return request<baseResponse<CreateCategoryRes>>('/api/categories', {
    method: 'POST',
    data,
  });
}

// 更新分类
export function UpdateCategory(id: number, data: UpdateCategoryReq) {
  return request<baseResponse<UpdateCategoryRes>>(`/api/categories/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除分类
export function DeleteCategory(id: number) {
  return request<baseResponse<string>>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

// 获取分类详情
export function GetCategoryDetail(id: number) {
  return request<baseResponse<GetCategoryDetailRes>>(`/api/categories/${id}`, {
    method: 'GET',
  });
}

// 获取分类列表
export function GetCategoryList(params?: GetCategoryListReq) {
  return request<baseResponse<GetCategoryListRes>>('/api/categories', {
    method: 'GET',
    params,
  });
}

// 获取热门分类
export function GetHotCategories() {
  return request<baseResponse<GetHotCategoryRes>>('/api/categories/hot', {
    method: 'GET',
  });
}

// 统一导出分类相关的API和类型
export * from './type';
