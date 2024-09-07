import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AITool from '../src/models/AITool';

dotenv.config({ path: '.env.local' });

async function updateComments() {
  try {
    // 连接到数据库
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // 获取所有 AI 工具
    const tools = await AITool.find({});
    console.log(`Found ${tools.length} AI tools`);

    let updatedCount = 0;
    let totalComments = 0;

    for (const tool of tools) {
      console.log(`Checking tool: ${tool.name}, Comments count: ${tool.comments.length}`);
      totalComments += tool.comments.length;
      let isUpdated = false;

      // 检查每个评论
      for (const comment of tool.comments) {
        if (!comment.likes) {
          comment.likes = 0;
          isUpdated = true;
        }
        if (!comment.dislikes) {
          comment.dislikes = 0;
          isUpdated = true;
        }
        if (!comment.userReaction) {
          comment.userReaction = null;
          isUpdated = true;
        }
        if (!comment.reports) {
          comment.reports = [];
          isUpdated = true;
        }
        if (!comment.replies) {
          comment.replies = [];
          isUpdated = true;
        }
        if (isUpdated) {
          updatedCount++;
          console.log(`Updated comment: ${comment._id}`);
        }
      }

      // 如果有更新，保存工具
      if (isUpdated) {
        await tool.save();
        console.log(`Updated comments for tool: ${tool.name}`);
      }
    }

    console.log(`Total comments: ${totalComments}`);
    console.log(`Updated ${updatedCount} comments`);
  } catch (error) {
    console.error('Error updating comments:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

updateComments();