import type { Metadata } from 'next';
import LoginForm from '@/components/login-form';
import ProtectedPage from '@/components/layout/protected-page';

export const metadata: Metadata = {
  title: 'Savvy Phone Companion',
  description: 'A web companion app for Savvy Phone',
};

export default function Home() {
  return (
    <div>
      <main className='flex min-h-screen flex-col items-center justify-center p-4'>
        <h1 className='mb-8 text-4xl font-bold'>Savvy Phone Companion</h1>
        <LoginForm />
      </main>
    </div>
  );
}
