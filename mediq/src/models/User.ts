import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export const createUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const user: User = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('users').insertOne(user);
  return { ...user, _id: result.insertedId };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const result = await db.collection('users').findOne({ email });
  return result as User | null;
};

export const findUserById = async (id: string): Promise<UserWithoutPassword | null> => {
  const client = await import('../lib/mongodb').then(m => m.default);
  const db = client.db('mediq');
  
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
  
  return user as UserWithoutPassword | null;
};
