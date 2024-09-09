import mongoose, { Schema, Document } from 'mongoose';

export interface IAITool extends Document {
  name: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  iconUrl: string;
  screenshotUrl?: string;
  ratings: {
    userId: Schema.Types.ObjectId;
    score: number;
  }[];
  comments: {
    user: Schema.Types.ObjectId;
    content: string;
    rating: number;
    createdAt: Date;
    likes: number;
    dislikes: number;
    replies: {
      user: Schema.Types.ObjectId;
      content: string;
      createdAt: Date;
    }[];
  }[];
  viewCount: number;
  averageRating: number;
  createdBy: Schema.Types.ObjectId;
}

const AIToolSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  tags: [String],
  iconUrl: { type: String, required: true },
  screenshotUrl: String,
  ratings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    score: Number
  }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }],
  viewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.models.AITool || mongoose.model<IAITool>('AITool', AIToolSchema);