export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  author: {
    name: string;
  };
  featured?: boolean;
} 