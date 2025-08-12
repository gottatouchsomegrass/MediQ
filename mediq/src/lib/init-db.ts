import bcrypt from 'bcryptjs';
import { createUser } from '@/models/User';
import { createAvailability } from '@/models/Availability';
import { createAppointment } from '@/models/Appointment';

export async function initializeDatabase() {
  try {
    console.log('Initializing database with demo data...');
    
    // Get database connection
    const client = await import('./mongodb').then(m => m.default);
    const db = client.db('mediq');
    
    // Check if data already exists
    const existingUsers = await db.collection('users').countDocuments();
    if (existingUsers > 0) {
      console.log('Database already contains data, skipping initialization.');
      return;
    }
    
    // Create demo users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const doctor = await createUser({
      email: 'doctor@mediq.com',
      password: hashedPassword,
      name: 'Dr. John Smith',
      role: 'doctor',
      specialty: 'Cardiology',
    });
    
    const patient = await createUser({
      email: 'patient@mediq.com',
      password: hashedPassword,
      name: 'Jane Doe',
      role: 'patient',
    });
    
    console.log('Demo users created successfully');
    
    // Create demo availability
    const availability = await createAvailability({
      doctorId: doctor._id!,
      start: new Date(2024, 0, 15, 9, 0),
      end: new Date(2024, 0, 15, 17, 0),
      doctorName: doctor.name,
      specialty: doctor.specialty!,
    });
    
    console.log('Demo availability created successfully');
    
    // Create demo appointment
    const appointment = await createAppointment({
      doctorId: doctor._id!,
      patientId: patient._id!,
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      reason: 'Regular checkup',
      status: 'scheduled',
      doctorName: doctor.name,
      patientName: patient.name,
      specialty: doctor.specialty!,
    });
    
    console.log('Demo appointment created successfully');
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
