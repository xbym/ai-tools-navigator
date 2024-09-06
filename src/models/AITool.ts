import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
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
  tags: [String],
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