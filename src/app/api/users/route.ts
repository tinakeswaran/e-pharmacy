import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(db.users);
}

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    db.save();
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
