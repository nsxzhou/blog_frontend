import type { ImageInfo, ImageStatistics } from '@/api/image';

// 过滤选项类型
export interface FilterOptions {
  usageType: string;
  storageType: string;
  dateRange: [string, string] | null;
}

// 排序类型
export type SortType = 'date' | 'size' | 'name';

// 图片网格组件 Props
export interface ImageGridProps {
  images: ImageInfo[];
  selectedImages: number[];
  onImageSelect: (imageId: number, selected: boolean) => void;
  onImageClick: (image: ImageInfo) => void;
  onImageDelete: (imageId: number) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
}

// 图片卡片组件 Props
export interface ImageCardProps {
  image: ImageInfo;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
  onDelete: () => void;
}

// 图片统计组件 Props
export interface ImageStatsProps {
  statistics?: ImageStatistics;
  loading: boolean;
}

// 图片过滤器组件 Props
export interface ImageFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (selected: boolean) => void;
  onBatchDelete: () => void;
}

// 图片上传弹窗 Props
export interface ImageUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// 图片详情弹窗 Props
export interface ImageDetailModalProps {
  image: ImageInfo | null;
  visible: boolean;
  onCancel: () => void;
  onUpdate: () => void;
  onDelete: (id: number) => void;
}

// 空状态组件 Props
export interface EmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  onUpload: () => void;
}

// 上传进度项
export interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// 使用类型选项
export const USAGE_TYPES = [
  { value: 'all', label: '全部类型' },
  { value: 'cover', label: '封面图' },
  { value: 'avatar', label: '头像' },
  { value: 'content', label: '内容图片' },
  { value: 'banner', label: '横幅' },
] as const;

// 存储类型选项
export const STORAGE_TYPES = [
  { value: 'all', label: '全部存储' },
  { value: 'local', label: '本地存储' },
  { value: 'cos', label: '腾讯云COS' },
  { value: 'oss', label: '阿里云OSS' },
] as const;

// 排序选项
export const SORT_OPTIONS = [
  { value: 'date', label: '上传时间' },
  { value: 'size', label: '文件大小' },
  { value: 'name', label: '文件名称' },
] as const;
