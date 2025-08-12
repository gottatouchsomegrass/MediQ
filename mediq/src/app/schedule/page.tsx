'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Clock, User } from 'lucide-react';
import Link from 'next/link';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: unknown;
  type: 'availability' | 'appointment';
  doctorId?: string;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
  specialty?: string;
}

export default function Schedule() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');

  // Mock doctors data
  const doctors = [
    { id: '1', name: 'Dr. John Smith', specialty: 'Cardiology' },
    { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Neurology' },
    { id: '3', name: 'Dr. Michael Brown', specialty: 'Orthopedics' },
  ];

  // Mock availability data
  const mockAvailability = [
    {
      id: '1',
      title: 'Available',
      start: new Date(2024, 0, 15, 9, 0),
      end: new Date(2024, 0, 15, 17, 0),
      type: 'availability' as const,
      doctorId: '1',
      doctorName: 'Dr. John Smith',
      specialty: 'Cardiology',
    },
    {
      id: '2',
      title: 'Available',
      start: new Date(2024, 0, 16, 10, 0),
      end: new Date(2024, 0, 16, 16, 0),
      type: 'availability' as const,
      doctorId: '2',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Neurology',
    },
  ];

  // Mock appointments
  const mockAppointments = [
    {
      id: '3',
      title: 'Appointment with Jane Doe',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      type: 'appointment' as const,
      doctorId: '1',
      patientId: '1',
      doctorName: 'Dr. John Smith',
      patientName: 'Jane Doe',
      specialty: 'Cardiology',
    },
  ];

  // Initialize events
  useEffect(() => {
    setEvents([...mockAvailability, ...mockAppointments]);
  }, []);

  const handleSelect = useCallback(({ start, end }: { start: Date; end: Date }) => {
    if (user?.role === 'doctor') {
      // Doctor can set availability
      const newEvent: Event = {
        id: Date.now().toString(),
        title: 'Available',
        start,
        end,
        type: 'availability',
        doctorId: user.id,
        doctorName: user.name,
        specialty: user.specialty,
      };
      setEvents(prev => [...prev, newEvent]);
    } else {
      // Patient can book appointment
      setSelectedSlot({ start, end });
      setIsDialogOpen(true);
    }
  }, [user]);

  const handleBookAppointment = () => {
    if (!selectedSlot || !selectedDoctor) return;

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return;

    const newAppointment: Event = {
      id: Date.now().toString(),
      title: `Appointment with ${doctor.name}`,
      start: selectedSlot.start,
      end: selectedSlot.end,
      type: 'appointment',
      doctorId: doctor.id,
      patientId: user?.id,
      doctorName: doctor.name,
      patientName: user?.name,
      specialty: doctor.specialty,
    };

    setEvents(prev => [...prev, newAppointment]);
    setIsDialogOpen(false);
    setSelectedSlot(null);
    setSelectedDoctor('');
    setAppointmentReason('');
  };

  const eventStyleGetter = useCallback((event: Event) => {
    const style: React.CSSProperties = {
      backgroundColor: event.type === 'availability' ? '#10B981' : '#3B82F6',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };

    if (event.type === 'appointment') {
      style.backgroundColor = '#EF4444';
    }

    return { style };
  }, []);

  const messages = {
    allDay: 'All Day',
    previous: '<',
    next: '>',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Time',
    event: 'Event',
    noEventsInRange: 'There are no events in this range.',
    showMore: (total: number) => `+ Show more (${total})`,
  };

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Schedule</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {user.name} ({user.role})
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user.role === 'doctor' ? 'Manage Your Schedule' : 'Book Appointments'}
            </h2>
            <p className="text-gray-600">
              {user.role === 'doctor' 
                ? 'Click and drag on the calendar to set your availability'
                : 'Click on available time slots to book appointments with doctors'
              }
            </p>
          </div>

          {/* Legend */}
          <div className="mb-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              selectable
              onSelectSlot={handleSelect}
              eventPropGetter={eventStyleGetter}
              messages={messages}
              defaultView="week"
              views={['month', 'week', 'day']}
              step={60}
              timeslots={1}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
            />
          </div>
        </div>
      </main>

      {/* Appointment Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="time">Time Slot</Label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {selectedSlot?.start.toLocaleString()} - {selectedSlot?.end.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                placeholder="Brief description of your visit"
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment} disabled={!selectedDoctor}>
                Book Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
