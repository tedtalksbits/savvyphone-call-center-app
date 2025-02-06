'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  logoutAccount,
  useGetAccountsLive,
} from '@/hooks/accounts/useAccountManagement';
import { axiosInstance } from '@/lib/axios';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('mtsswitch.cticloud.us');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post(
        'http://localhost:6060/login',

        { username, password, domain },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const { accounts, isLoading } = useGetAccountsLive();
  const isAnyAccountActive = accounts.some((account) => account.active);

  useEffect(() => {
    if (isAnyAccountActive) {
      router.push('/dashboard');
    }
  }, [isAnyAccountActive, router]);

  if (isLoading) return <p>Loading...</p>;

  const handleLogoutAccount = async (accountName: string) => {
    await logoutAccount(accountName);
    router.push('/');
  };

  return (
    <>
      {isAnyAccountActive && (
        <p>
          You can go to <Link href={'/dashboard'}>Dashboard</Link>
        </p>
      )}
      {accounts.length > 0 && (
        <div className='space-y-2'>
          <h2>You are already logged in:</h2>
          <ul>
            {accounts.map((account) => (
              <li key={account.id} className='flex items-center space-x-2'>
                <span>{account.name}</span>
                <Link href='/dashboard'>
                  <Button
                    className={cn('', {
                      'bg-destructive text-destructive-foreground hover:bg-destructive/90':
                        !account.active,
                      'bg-green-500 text-green-100 hover:bg-green-600':
                        account.active,
                    })}
                  >
                    {account.status}
                  </Button>
                </Link>
                <Button
                  variant='destructive'
                  onClick={async () => await handleLogoutAccount(account.name)}
                >
                  Logout
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <>
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
          <div>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='domain'>Domain</Label>
            <Input
              id='domain'
              type='text'
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <Button type='submit' className='w-full'>
            Add Account
          </Button>
          {error && <p className='text-destructive text-sm'>{error}</p>}
        </form>
      </>
    </>
  );
}
