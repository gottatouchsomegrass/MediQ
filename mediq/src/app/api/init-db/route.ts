import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { message: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
