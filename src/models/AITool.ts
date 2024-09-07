import mongoose, { Schema, Document } from 'mongoose';

interface ValidatorProps {
  value: any;
}

interface IReply extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  rating: number;
  createdAt: Date;
  likes: number;
  dislikes: number;
  reports: mongoose.Types.ObjectId[];
  replies: IReply[];
}

const ReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [ReplySchema]
});

interface IComment {
  rating: number;
}

const AIToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  screenshotUrl: { type: String },
  category: { type: String, required: true },
  url: { type: String, required: true },
  ratings: [{ userId: String, score: Number }],
  averageRating: { type: Number, default: 0 },
  comments: [CommentSchema],
  tags: { type: [String], default: [] },  // 确保这个字段存在
  viewCount: { type: Number, default: 0 }
});

// 添加文本索引
AIToolSchema.index({ name: 'text', description: 'text', tags: 'text' });

// 添加一个方法来更新平均评分
AIToolSchema.methods.updateAverageRating = function() {
  const ratingsSum = this.comments.reduce((sum: number, comment: IComment) => sum + comment.rating, 0);
  this.averageRating = ratingsSum / this.comments.length || 0;
  this.totalRatings = this.comments.length;
};

export default mongoose.models.AITool || mongoose.model('AITool', AIToolSchema);