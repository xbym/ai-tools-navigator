export interface AITool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags?: string[];
  iconUrl: string;
  screenshotUrl?: string;
  comments: Comment[];
  ratings: Rating[];
  averageRating: number;
  viewCount: number;
}

export interface Comment {
  _id: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  rating: number;
  createdAt: string;
  replies: Reply[];
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
  userReactions?: { [userId: string]: 'like' | 'dislike' };
  reports: Report[]; // 新增字段
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

// 新增接口
export interface Report {
  userId: string;
  reason: string;
  createdAt: string;
}