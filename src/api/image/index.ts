import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  BatchDeleteImageReq,
  BatchDeleteImageRes,
  DeleteImageRes,
  GetImageDetailRes,
  GetImageListReq,
  GetImageListRes,
  GetImagesByArticleReq,
  GetImagesByTypeReq,
  GetImageStatisticsRes,
  GetStorageConfigRes,
  UpdateImageReq,
  UpdateImageRes,
  UploadImageReq,
  UploadImageRes,
} from './type';

// 上传图片
export function UploadImage(data: UploadImageReq) {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('usage_type', data.usage_type);
  formData.append('storage_type', data.storage_type);
  if (data.article_id) {
    formData.append('article_id', data.article_id.toString());
  }

  return request<baseResponse<UploadImageRes>>('/api/images/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 更新图片信息
export function UpdateImage(id: number, data: UpdateImageReq) {
  return request<baseResponse<UpdateImageRes>>(`/api/images/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除图片
export function DeleteImage(id: number) {
  return request<baseResponse<DeleteImageRes>>(`/api/images/${id}`, {
    method: 'DELETE',
  });
}

// 批量删除图片
export function BatchDeleteImages(data: BatchDeleteImageReq) {
  return request<baseResponse<BatchDeleteImageRes>>(
    '/api/images/batch-delete',
    {
      method: 'POST',
      data,
    },
  );
}

// 获取图片详情
export function GetImageDetail(id: number) {
  return request<baseResponse<GetImageDetailRes>>(`/api/images/${id}`, {
    method: 'GET',
  });
}

// 获取图片列表
export function GetImageList(params?: GetImageListReq) {
  return request<baseResponse<GetImageListRes>>('/api/images', {
    method: 'GET',
    params,
  });
}

// 获取存储配置
export function GetStorageConfig() {
  return request<baseResponse<GetStorageConfigRes>>('/api/images/config', {
    method: 'GET',
  });
}

// 根据使用类型获取图片
export function GetImagesByType(
  type: string,
  params?: Omit<GetImagesByTypeReq, 'type'>,
) {
  return request<baseResponse<GetImageListRes>>(`/api/images/type/${type}`, {
    method: 'GET',
    params,
  });
}

// 根据文章ID获取图片
export function GetImagesByArticle(
  articleId: number,
  params?: Omit<GetImagesByArticleReq, 'article_id'>,
) {
  return request<baseResponse<GetImageListRes>>(
    `/api/images/article/${articleId}`,
    {
      method: 'GET',
      params,
    },
  );
}

// 获取图片统计数据
export function GetImageStatistics() {
  return request<baseResponse<GetImageStatisticsRes>>(
    '/api/images/statistics',
    {
      method: 'GET',
    },
  );
}

// 统一导出图片相关的API和类型
export * from './type';
