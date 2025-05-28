// 评论信息接口
export interface Comment {
  id: number;
  content: string;
  article_id: number;
  user_id: number;
  parent_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  };
  like_count: number;
  liked_by_me: boolean;
}

// 创建评论请求参数
export interface CreateCommentReq {
  article_id: number;
  content: string;
  parent_id?: number | null;
}

// 创建评论响应数据
export interface CreateCommentRes {
  comment: Comment;
}
export interface CommentDetail {
  id: number;
  content: string;
  article_id: number;
  user_id: number;
  parent_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  };
  parent: {
    id: number;
    content: string;
    user_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    user: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
    };
    like_count: number;
  };
  like_count: number;
  liked_by_me: boolean;
}

// 回复评论请求参数
export interface ReplyCommentReq {
  comment_id: number;
  content: string;
}

// 回复评论响应数据
export interface ReplyCommentRes {
  comment: CommentDetail;
}

export interface CommentItemChildren {
  id: number;
  content: string;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  };
  like_count: number;
}

export interface CommentItem {
  id: number;
  content: string;
  article_id: number;
  user_id: number;
  parent_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  };
  children: CommentItemChildren[];
  like_count: number;
  liked_by_me: boolean;
}

// 更新评论请求参数
export interface UpdateCommentReq {
  content?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// 更新评论响应数据
export interface UpdateCommentRes {
  comment: CommentItem;
}

// 点赞评论请求参数
export interface LikeCommentReq {
  comment_id: number;
}

// 更新评论状态请求参数
export interface UpdateCommentStatusReq {
  status: 'pending' | 'approved' | 'rejected';
}

export interface UpdateCommentStatus {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  article_id: number;
  user_id: number;
  parent_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  reject_reason: string;
  like_count: number;
  article: {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    summary: string;
    status: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    favorite_count: number;
    author_id: number;
    category_id: number;
    cover_image: string;
    word_count: number;
    access_type: string;
    password: string;
    is_top: number;
    is_original: number;
    source_url: string;
    source_name: string;
    published_at: null;
    es_doc_id: string;
    author: {
      id: number;
      created_at: string;
      updated_at: string;
      username: string;
      email: string;
      avatar: string;
      nickname: string;
      bio: string;
      role: string;
      status: number;
      last_login_at: string;
      last_login_ip: string;
      is_verified: number;
      phone: string;
      is_phone_verified: number;
    };
    category: {
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
      description: string;
      icon: string;
      article_count: number;
      is_visible: number;
    };
  };
  user: {
    id: number;
    created_at: string;
    updated_at: string;
    username: string;
    email: string;
    avatar: string;
    nickname: string;
    bio: string;
    role: string;
    status: number;
    last_login_at: string;
    last_login_ip: string;
    is_verified: number;
    phone: string;
    is_phone_verified: number;
  };
}

// 更新评论状态响应数据
export interface UpdateCommentStatusRes {
  comment: UpdateCommentStatus;
}

// 批量更新评论状态请求参数
export interface BatchUpdateCommentStatusReq {
  ids: number[];
  status: 'pending' | 'approved' | 'rejected';
}

// 评论列表查询参数
export interface CommentListQuery {
  page?: number;
  page_size?: number;
  order_by?: string;
  order?: 'asc' | 'desc';
  status?: 'pending' | 'approved' | 'rejected';
  article_id?: number;
  user_id?: number;
  parent_id?: number | null;
}

// 评论列表响应数据
export interface CommentListRes {
  list: CommentItem[];
  total: number;
}

// 获取评论详情响应数据
export interface GetCommentRes {
  list: CommentItem[];
  total: number;
}
