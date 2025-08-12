import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, specialty } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role !== 'patient' && role !== 'doctor') {
      return NextResponse.json(
        { message: 'Invalid role. Must be patient or doctor' },
        { status: 400 }
      );
    }

    if (role === 'doctor' && !specialty) {
      return NextResponse.json(
        { message: 'Specialty is required for doctors' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await createUser({
      email,
      name,
      role,
      specialty,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully', user: { ...user, password: undefined } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
