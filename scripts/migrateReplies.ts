import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AITool from '../src/models/AITool';
import User from '../src/models/User';

dotenv.config({ path: '.env.local' });

async function migrateReplies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const tools = await AITool.find({});

    for (const tool of tools) {
      let isUpdated = false;
      for (const comment of tool.comments) {
        for (const reply of comment.replies) {
          if (!reply.username) {
            isUpdated = true;
            const user = await User.findById(reply.userId);
            reply.username = user ? user.username : 'Anonymous';
          }
        }
      }
      if (isUpdated) {
        await tool.save();
        console.log(`Updated replies for tool: ${tool.name}`);
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.connection.close();
  }
}

migrateReplies();