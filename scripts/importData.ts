import fs from 'fs';
import path from 'path';
import dbConnect from '../src/lib/dbConnect';
import AITool from '../src/models/AITool';

async function importData() {
  await dbConnect();

  const jsonPath = path.join(process.cwd(), 'data', 'ai-tools.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const tools = JSON.parse(jsonData);

  try {
    await AITool.deleteMany({});
    await AITool.insertMany(tools);
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }

  process.exit();
}

importData();