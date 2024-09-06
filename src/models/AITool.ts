import mongoose from 'mongoose';

interface ValidatorProps {
  value: any;
}

const CommentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    validate: {
      validator: function(v: any) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props: ValidatorProps) => `${props.value} is not a valid ObjectId!`
    }
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [1, 'Comment content cannot be empty']
  },
  rating: { 
    type: Number, 
    required: true, 
    min: [1, 'Rating must be at least 1'], 
    max: [5, 'Rating cannot be more than 5']
  },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  userReactions: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reaction: { type: String, enum: ['like', 'dislike'] }
  }]
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