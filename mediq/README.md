# MediQ - Healthcare Appointment Booking Platform

MediQ is a comprehensive healthcare website that connects patients with doctors through an intuitive appointment booking system. Built with Next.js, TypeScript, and modern web technologies.

## Features

- **Dual Account Types**: Separate interfaces for patients and doctors
- **Authentication System**: Secure sign-in, sign-up, and sign-out functionality
- **Interactive Scheduling**: React Big Calendar integration for appointment management
- **Doctor Availability**: Doctors can set their available time slots
- **Patient Booking**: Patients can book appointments with available doctors
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: NextAuth.js
- **Calendar**: React Big Calendar
- **Database**: MongoDB (configured but using mock data for demo)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (optional for demo)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mediq
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
MONGODB_URI=mongodb://localhost:27017/mediq
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Patients
1. Sign up as a patient
2. Browse available doctors and their specialties
3. View doctor availability on the calendar
4. Book appointments in available time slots
5. Manage your appointment history

### For Doctors
1. Sign up as a doctor (requires specialty information)
2. Set your availability by clicking and dragging on the calendar
3. View patient appointments
4. Manage your schedule

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Doctor:**
- Email: doctor@mediq.com
- Password: any password (demo mode)
- Specialty: Cardiology

**Patient:**
- Email: patient@mediq.com
- Password: any password (demo mode)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── schedule/          # Scheduling interface
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Radix UI components
├── context/               # React context providers
├── types/                 # TypeScript type definitions
└── middleware.ts          # Route protection
```

## Key Components

- **AuthProvider**: Manages authentication state and user sessions
- **Schedule Page**: Interactive calendar for doctors and patients
- **Dashboard**: Role-based dashboard with quick actions
- **Authentication Pages**: Sign-in and sign-up forms

## Customization

### Adding New Specialties
Edit the mock data in the schedule page to include new medical specialties.

### Styling
The application uses Tailwind CSS. Modify the classes in the components to change the appearance.

### Database Integration
Replace the mock data with actual database calls in the API routes and components.

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

3. Update environment variables in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
