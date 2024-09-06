export interface AITool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
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
}

export interface Rating {
  userId: string;
  score: number;
}