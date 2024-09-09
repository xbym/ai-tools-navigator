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
  content: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  rating: number;
  createdAt: string;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
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
  content: string;
  avatarUrl?: string;
  createdAt: string;
}

// 新增接口
export interface Report {
  userId: string;
  reason: string;
  createdAt: string;
}