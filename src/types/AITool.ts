export interface AITool {
  _id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  url: string;
  ratings: number[];
  comments: Comment[];
  tags: string[];
}

export interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}