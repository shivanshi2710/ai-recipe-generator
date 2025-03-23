import { NextResponse } from 'next/server';
import { historyCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const history = await historyCollection.find().sort({ timestamp: -1 }).toArray(); // Sort by most recent
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { recipe } = await request.json();

  try {
    const result = await historyCollection.insertOne({ recipe, timestamp: new Date() });
    return NextResponse.json({ _id: result.insertedId, recipe, timestamp: new Date() });
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}