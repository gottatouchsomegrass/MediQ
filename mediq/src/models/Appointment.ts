import { ObjectId } from 'mongodb';

export interface Appointment {
  _id?: ObjectId;
  doctorId: ObjectId;
  patientId: ObjectId;
  start: Date;
  end: Date;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctorName: string;
  patientName: string;
  specialty: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createAppointment = async (appointmentData: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>) => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const appointment: Appointment = {
    ...appointmentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('appointments').insertOne(appointment);
  return { ...appointment, _id: result.insertedId };
};

export const findAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  return await db.collection('appointments')
    .find({ doctorId: new ObjectId(doctorId) })
    .sort({ start: 1 })
    .toArray();
};

export const findAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  return await db.collection('appointments')
    .find({ patientId: new ObjectId(patientId) })
    .sort({ start: 1 })
    .toArray();
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  return await db.collection('appointments').updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );
};
