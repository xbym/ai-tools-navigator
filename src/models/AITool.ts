import mongoose from 'mongoose';

const AIToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  screenshotUrl: { type: String }, // 添加这行
  category: { type: String, required: true },
  url: { type: String, required: true },
  ratings: [Number],
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String]
});

export default mongoose.models.AITool || mongoose.model('AITool', AIToolSchema);