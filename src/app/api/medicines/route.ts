import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(db.medicines);
}

export async function POST(request: Request) {
  try {
    const medicine = await request.json();
    const newMedicine = {
      ...medicine,
      id: Math.random().toString(36).substr(2, 9),
      price: parseFloat(medicine.price),
      stock: parseInt(medicine.stock)
    };
    db.medicines.push(newMedicine);
    db.save();
    return NextResponse.json(newMedicine);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add medicine' }, { status: 400 });
  }
}
