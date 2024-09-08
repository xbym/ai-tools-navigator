import mongoose, { Schema, Document } from 'mongoose';

const ReplySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // 确保这行存在
  content: { type: String, required: true },
  avatarUrl: { type: String, default: '/default-avatar.png' },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  userReactions: { type: Map, of: String },
  reports: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export interface IAITool extends Document {
  // ... 其他字段 ...
  ratings: number[];
  averageRating: number;
  comments: mongoose.Types.DocumentArray<any>;
  updateAverageRating: () => void;
}

const AIToolSchema: Schema = new Schema({
  // ... 其他字段 ...
  ratings: [Number],
  averageRating: { type: Number, default: 0 },
  comments: [CommentSchema]
});

AIToolSchema.methods.updateAverageRating = function(this: IAITool) {
  const ratings = this.ratings;
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
    : 0;
  this.averageRating = Number(averageRating.toFixed(2));
};

const AITool = mongoose.models.AITool || mongoose.model<IAITool>('AITool', AIToolSchema);

export default AITool;