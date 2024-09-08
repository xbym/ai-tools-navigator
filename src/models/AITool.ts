import mongoose, { Schema, Document } from 'mongoose';

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  userReactions: { type: Map, of: String },
  reports: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export interface IAITool extends Document {
  // ... 其他字段 ...
  ratings: number[];
  averageRating: number;
  comments: mongoose.Types.DocumentArray<mongoose.Types.ObjectId>;
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