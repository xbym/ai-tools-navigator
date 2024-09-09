import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AITool from '@/models/AITool';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`API route called for tool ID: ${params.id}`);
  try {
    await dbConnect();
    console.log('Database connected');
    if (!params.id) {
      console.log('No ID provided');
      return NextResponse.json({ message: 'No ID provided' }, { status: 400 });
    }
    const tool = await AITool.findById(params.id).lean();
    console.log('Tool found:', tool);
    if (!tool) {
      console.log('Tool not found in database');
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: `Error fetching tool: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}