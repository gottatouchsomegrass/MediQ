import { ObjectId } from 'mongodb';

export interface Availability {
  _id?: ObjectId;
  doctorId: ObjectId;
  start: Date;
  end: Date;
  doctorName: string;
  specialty: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createAvailability = async (availabilityData: Omit<Availability, '_id' | 'createdAt' | 'updatedAt'>) => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const availability: Availability = {
    ...availabilityData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('availability').insertOne(availability);
  return { ...availability, _id: result.insertedId };
};

export const findAvailabilityByDoctor = async (doctorId: string): Promise<Availability[]> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const result = await db.collection('availability')
    .find({ doctorId: new ObjectId(doctorId) })
    .sort({ start: 1 })
    .toArray();
  
  return result as Availability[];
};

export const findAvailableDoctors = async (start: Date, end: Date): Promise<Availability[]> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const result = await db.collection('availability')
    .find({
      start: { $lte: start },
      end: { $gte: end }
    })
    .sort({ start: 1 })
    .toArray();
  
  return result as Availability[];
};

export const deleteAvailability = async (id: string) => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  return await db.collection('availability').deleteOne({ _id: new ObjectId(id) });
};
