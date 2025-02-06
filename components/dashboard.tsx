'use client';
import CallControl from './call-control';
import { Accounts } from '@/app/dashboard/components/accounts';

export default function Dashboard() {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold mb-4'>Agent Dashboard</h1>
        <Accounts />
      </div>
      <CallControl />
    </div>
  );
}
