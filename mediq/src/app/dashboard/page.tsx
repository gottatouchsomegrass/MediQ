'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, User, Stethoscope, Clock, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">MediQ</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user.name}</span>
                {user.role === 'doctor' && (
                  <span className="ml-2 text-blue-600">({user.specialty})</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {user.role === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}
            </h2>
            <p className="text-gray-600">
              {user.role === 'doctor' 
                ? 'Manage your schedule and patient appointments'
                : 'Book appointments and manage your health records'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/schedule">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                    <p className="text-gray-600">
                      {user.role === 'doctor' 
                        ? 'Set your availability'
                        : 'Book appointments'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {user.role === 'doctor' ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
                    <p className="text-gray-600">View patient appointments</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Doctors</h3>
                    <p className="text-gray-600">Find and book with specialists</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">History</h3>
                  <p className="text-gray-600">
                    {user.role === 'doctor' 
                      ? 'View past appointments'
                      : 'Your appointment history'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Your appointments and activities will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
