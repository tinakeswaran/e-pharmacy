import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(db.reviews);
}

export async function POST(request: Request) {
  try {
    const review = await request.json();
    const newReview = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    db.reviews.push(newReview);
    db.save();
    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post review' }, { status: 400 });
  }
}
