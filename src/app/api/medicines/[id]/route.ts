import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const medicine = await request.json();
    const index = db.medicines.findIndex(m => m.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.medicines[index] = {
      ...db.medicines[index],
      ...medicine,
      price: parseFloat(medicine.price),
      stock: parseInt(medicine.stock)
    };
    db.save();
    return NextResponse.json(db.medicines[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update medicine' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = db.medicines.findIndex(m => m.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.medicines.splice(index, 1);
  db.save();
  return NextResponse.json({ success: true });
}
