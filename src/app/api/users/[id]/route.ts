import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  if (db.users[index].role === 'Admin') {
    return NextResponse.json({ error: 'Cannot delete admin' }, { status: 403 });
  }

  db.users.splice(index, 1);
  db.save();
  return NextResponse.json({ success: true });
}
