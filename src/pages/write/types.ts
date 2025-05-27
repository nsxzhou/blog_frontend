// 文章数据类型
export interface ArticleData {
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    category: string;
    coverImage?: string;
    isDraft: boolean;
}

// 写作页面的状态类型
export interface WritePageState {
    loading: boolean;
    saving: boolean;
    previewMode: boolean;
    settingsVisible: boolean;
    newTag: string;
}

// 文章设置类型
export interface ArticleSettings {
    seoKeywords?: string;
    customUrl?: string;
    allowComments: boolean;
    isFeatured: boolean;
    enableRss: boolean;
    showReadTime: boolean;
    password?: string;
    publishTime?: string;
}

// 组件通用Props类型
export interface BaseWriteProps {
    loading?: boolean;
    saving?: boolean;
} 