export interface ActivityItem {
  id: string;
  type: 'article' | 'like' | 'comment' | 'follow' | 'edit' | 'delete';
  title: string;
  description: string;
  time: string;
  target?: string;
}

export interface StatsData {
  articles: number;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  following: number;
}
