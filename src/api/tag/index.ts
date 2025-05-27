import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  CreateTagReq,
  CreateTagRes,
  DeleteTagRes,
  GetTagDetailRes,
  GetTagListReq,
  GetTagListRes,
  UpdateTagReq,
  UpdateTagRes,
} from './type';

// 创建标签
export function CreateTag(data: CreateTagReq) {
  return request<baseResponse<CreateTagRes>>('/api/tags', {
    method: 'POST',
    data,
  });
}

// 更新标签
export function UpdateTag(id: number, data: UpdateTagReq) {
  return request<baseResponse<UpdateTagRes>>(`/api/tags/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除标签
export function DeleteTag(id: number) {
  return request<baseResponse<DeleteTagRes>>(`/api/tags/${id}`, {
    method: 'DELETE',
  });
}

// 获取标签详情
export function GetTagDetail(id: number) {
  return request<baseResponse<GetTagDetailRes>>(`/api/tags/${id}`, {
    method: 'GET',
  });
}

// 获取标签列表
export function GetTagList(params?: GetTagListReq) {
  return request<baseResponse<GetTagListRes>>('/api/tags', {
    method: 'GET',
    params,
  });
}

// 统一导出标签相关的API和类型
export * from './type';
