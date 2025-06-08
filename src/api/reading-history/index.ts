import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  BatchDeleteReadingHistoryReq,
  CreateReadingHistoryReq,
  GetReadingHistoryReq,
  GetReadingHistoryRes,
} from './type';

// 获取用户阅读历史列表
export function GetReadingHistory(params: GetReadingHistoryReq) {
  return request<baseResponse<GetReadingHistoryRes>>('/api/reading-history', {
    method: 'GET',
    params,
  });
}

// 记录阅读历史
export function CreateReadingHistory(data: CreateReadingHistoryReq) {
  return request<baseResponse<null>>('/api/reading-history', {
    method: 'POST',
    data,
  });
}

// 删除阅读历史记录（批量）
export function BatchDeleteReadingHistory(data: BatchDeleteReadingHistoryReq) {
  return request<baseResponse<null>>('/api/reading-history', {
    method: 'DELETE',
    data,
  });
}

// 删除单个阅读历史记录
export function DeleteReadingHistory(id: number) {
  return request<baseResponse<null>>(`/api/reading-history/${id}`, {
    method: 'DELETE',
  });
}

// 清空用户所有阅读历史
export function ClearReadingHistory() {
  return request<baseResponse<null>>('/api/reading-history/clear', {
    method: 'DELETE',
  });
}

// 统一导出阅读历史相关的API和类型
export * from './type';
