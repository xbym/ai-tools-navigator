import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: 'comment_report';
  toolId: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['comment_report'] },
  toolId: { type: Schema.Types.ObjectId, ref: 'AITool', required: true },
  commentId: { type: Schema.Types.ObjectId, required: true },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);