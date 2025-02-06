import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function ClientError() {
  return (
    <div>
      <h1 className='text-4xl font-bold'>Client Error</h1>
      <p className='mt-4'>
        Please make sure Savvy Phone is running and try again.
      </p>
      <Link href='/' className='mt-4 inline-block'>
        <Button> Go back to the login page</Button>
      </Link>
    </div>
  );
}
