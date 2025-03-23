import { NextResponse } from 'next/server';
import { favoritesCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const favorites = await favoritesCollection.find().toArray();
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { recipe } = await request.json();

  try {
    const result = await favoritesCollection.insertOne({ recipe, likes: 0 });
    return NextResponse.json({ _id: result.insertedId, recipe, likes: 0 });
  } catch (error) {
    console.error('Error saving favorite:', error);
    return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id } = await request.json();

  try {
    const result = await favoritesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } } // Increment likes by 1
    );
    return NextResponse.json({ message: 'Recipe liked successfully' });
  } catch (error) {
    console.error('Error liking recipe:', error);
    return NextResponse.json({ error: 'Failed to like recipe' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id, clearAll } = await request.json();

  try {
    if (clearAll) {
      await favoritesCollection.deleteMany({});
      return NextResponse.json({ message: 'All favorites cleared' });
    } else {
      await favoritesCollection.deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Recipe deleted from favorites' });
    }
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}