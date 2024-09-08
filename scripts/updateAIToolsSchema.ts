import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AITool from '../src/models/AITool';

dotenv.config({ path: '.env.local' });

async function updateAIToolsSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const tools = await AITool.find({});
    for (const tool of tools) {
      if (!tool.ratings) {
        tool.ratings = [];
      }
      if (!tool.averageRating) {
        tool.averageRating = 0;
      }
      if (!tool.comments) {
        tool.comments = [];
      }
      await tool.save();
    }

    console.log('AITools schema updated successfully');
  } catch (error) {
    console.error('Error updating AITools schema:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateAIToolsSchema();