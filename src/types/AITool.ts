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
    username: string;
    avatarUrl: string;
  };
  content: string;
  rating: number;
  createdAt: string;
}

export interface Rating {
  userId: string;
  score: number;
}