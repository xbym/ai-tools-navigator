import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AITool from '../src/models/AITool';

dotenv.config({ path: '.env.local' });

// 定义评论的接口
interface IComment {
  userId: mongoose.Types.ObjectId | string;
  rating: number;
  // 添加其他可能的字段
  content?: string;
  createdAt?: Date;
}

async function checkComments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const tools = await AITool.find({});
    let invalidComments = 0;
    let totalComments = 0;

    for (const tool of tools) {
      for (const comment of tool.comments) {
        totalComments++;
        if (!mongoose.Types.ObjectId.isValid(comment.userId)) {
          invalidComments++;
          console.log(`Invalid userId found: ${comment.userId} in tool: ${tool._id}`);
        }
        if (typeof comment.rating !== 'number' || comment.rating < 1 || comment.rating > 5) {
          invalidComments++;
          console.log(`Invalid rating found: ${comment.rating} in tool: ${tool._id}`);
        }
      }
    }

    console.log(`Total comments: ${totalComments}`);
    console.log(`Invalid comments: ${invalidComments}`);

    if (invalidComments > 0) {
      console.log('Would you like to remove invalid comments? (y/n)');
      process.stdin.once('data', async (data) => {
        if (data.toString().trim().toLowerCase() === 'y') {
          for (const tool of tools) {
            tool.comments = tool.comments.filter((comment: IComment) => 
              mongoose.Types.ObjectId.isValid(comment.userId) &&
              typeof comment.rating === 'number' &&
              comment.rating >= 1 &&
              comment.rating <= 5
            );
            await tool.save();
          }
          console.log('Invalid comments removed');
        }
        mongoose.connection.close();
      });
    } else {
      mongoose.connection.close();
    }
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkComments();