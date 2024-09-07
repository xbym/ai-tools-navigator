import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Please check your .env.local file.');
  process.exit(1);
}

import fs from 'fs';
import dbConnect from '../src/lib/dbConnect';
import AITool from '../src/models/AITool';

async function migrateData() {
  await dbConnect();

  const jsonPath = path.join(process.cwd(), 'data', 'ai-tools.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const tools = JSON.parse(jsonData);

  try {
    await AITool.deleteMany({});
    await AITool.insertMany(tools.map((tool: any) => ({
      ...tool,
      tags: tool.tags || [],  // 确保每个工具都有 tags 字段
    })));
    console.log('Data migrated successfully');
  } catch (error) {
    console.error('Error migrating data:', error);
  }

  process.exit();
}

migrateData();