// RSS查询参数
export interface RSSQuery {
  limit?: number; // 限制文章数量，默认20
  category_id?: number; // 按分类筛选
  tag_id?: number; // 按标签筛选
}

// RSS订阅项
export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  author: string;
  category: string;
  enclosure?: {
    url: string;
    type: string;
    length: number;
  };
}

// RSS频道信息
export interface RSSChannel {
  title: string;
  description: string;
  link: string;
  language: string;
  lastBuildDate: string;
  generator: string;
  webMaster: string;
  managingEditor: string;
  items: RSSItem[];
}

// RSS响应数据
export interface RSSFeedRes {
  channel: RSSChannel;
}
