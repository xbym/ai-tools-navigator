import mongoose from 'mongoose';

const AIToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  screenshotUrl: { type: String },
  category: { type: String, required: true },
  url: { type: String, required: true },
  ratings: [{ userId: String, score: Number }],
  averageRating: { type: Number, default: 0 },
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  viewCount: { type: Number, default: 0 } // 确保这一行存在
});

// 添加文本索引
AIToolSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.AITool || mongoose.model('AITool', AIToolSchema);