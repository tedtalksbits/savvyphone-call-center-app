import {
  logoutAccount,
  logoutAllAccount,
  useGetAccountsLive,
} from '@/hooks/accounts/useAccountManagement';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Accounts = () => {
  const router = useRouter();
  const { accounts, isLoading, error } = useGetAccountsLive();
  const handleLogoutAll = async () => {
    await logoutAllAccount();
    router.push('/');
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={'icon'}
          variant='secondary'
          className='rounded-full size-12'
        >
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {accounts.map((account) => (
          <DropdownMenuItem key={account.id}>
            {account.name.split('@')[0]} {account.active ? ' (active)' : ''}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogoutAll}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
