import ProtectedPage from '@/components/layout/protected-page';
import React from 'react';

export default function Page() {
  return (
    <ProtectedPage>
      <div>Page</div>
    </ProtectedPage>
  );
}
