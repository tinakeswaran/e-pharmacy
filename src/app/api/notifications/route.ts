import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(db.notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));
}

export async function POST(request: Request) {
  try {
    const note = await request.json();
    const newNote = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      readBy: []
    };
    db.notifications.push(newNote);
    db.save();
    return NextResponse.json(newNote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 400 });
  }
}
