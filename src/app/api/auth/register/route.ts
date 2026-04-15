import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    if (db.users.some(u => u.username === username || u.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      passwordHash: password, // In real app, hash this!
      role: 'User' as const,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.save();

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', newUser.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
