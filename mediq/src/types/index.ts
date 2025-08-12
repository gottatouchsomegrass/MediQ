export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  specialty?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
  type: 'availability' | 'appointment';
  doctorId?: string;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
  specialty?: string;
  reason?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  start: Date;
  end: Date;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctorName: string;
  patientName: string;
  specialty: string;
}

export interface Availability {
  id: string;
  doctorId: string;
  start: Date;
  end: Date;
  doctorName: string;
  specialty: string;
}
