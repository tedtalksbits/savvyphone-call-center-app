import { isAccountActive, isSavvyPhoneRunning } from '@/auth-services';
import { redirect } from 'next/navigation';
import React from 'react';

const ProtectedPage = async ({ children }: { children: React.ReactNode }) => {
  const isClientConnected = await isSavvyPhoneRunning();
  const isActive = await isAccountActive();
  if (!isClientConnected) {
    return redirect('/client-error');
  }
  if (!isActive) {
    return redirect('/');
  }
  return <>{children}</>;
};

export default ProtectedPage;
