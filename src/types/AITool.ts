export interface AITool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags?: string[];  // 确保这是可选的
  iconUrl: string;
  screenshotUrl?: string;
  comments: Comment[];
  ratings: Rating[];
  averageRating: number;
  viewCount: number;
}

export interface Comment {
  _id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  rating: number;
  createdAt: string;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
  reports?: string[];  // 添加这行
  toolId?: string;     // 添加这行
  replies: Reply[];
}

export interface Rating {
  userId: string;
  score: number;
}

export interface Reply {
  _id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}