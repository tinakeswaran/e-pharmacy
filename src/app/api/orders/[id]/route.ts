import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    db.orders[index].status = status;
    db.save();
    return NextResponse.json(db.orders[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 400 });
  }
}
