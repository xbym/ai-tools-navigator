import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: String,
  url: String,
  method: String,
  params: Object,
  query: Object,
  body: Object,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  type: { type: String, enum: ['client', 'server'], required: true },
  component: String, // 记录错误发生的组件或模块
  userId: String, // 如果有用户系统，可以记录用户ID
});

ErrorLogSchema.index({ timestamp: -1, severity: 1, type: 1 });

export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);