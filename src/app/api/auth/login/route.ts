import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const user = db.users.find(u => 
      (u.username === username || u.email === username) && 
      u.passwordHash === password
    );

    if (user) {
      const response = NextResponse.json({ 
        success: true, 
        role: user.role,
        redirect: user.role === 'Admin' ? '/admin' : '/dashboard'
      });
      
      response.cookies.set('auth_token', user.id, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      });
      
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
