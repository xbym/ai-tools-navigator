export interface AITool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags: string[] | string;  // 允许 tags 是字符串数组或字符串
  iconUrl: string;
  screenshotUrl?: string;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}