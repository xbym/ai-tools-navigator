export interface AITool {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  url: string;
  ratings: number[];
  comments: Comment[];
  tags: string[]; // 新增的标签字段
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}