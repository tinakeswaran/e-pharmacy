import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(db.orders);
}

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    const newOrder = {
      ...orderData,
      id: `ORD${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      paymentStatus: 'Paid',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    db.orders.push(newOrder);
    db.save();
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
