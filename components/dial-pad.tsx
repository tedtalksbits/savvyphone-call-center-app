'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DialPadProps {
  onDial: (number: string) => void;
}

export default function DialPad({ onDial }: DialPadProps) {
  const [number, setNumber] = useState('');

  const dialPadNumbers = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '*',
    '0',
    '#',
  ];

  const handleButtonClick = (value: string) => {
    setNumber((prevNumber) => prevNumber + value);
  };

  const handleBackspace = () => {
    setNumber((prevNumber) => prevNumber.slice(0, -1));
  };

  const handleDial = () => {
    if (number) {
      onDial(number);
      setNumber('');
    }
  };

  return (
    <div className='w-full max-w-xs mx-auto'>
      <Input
        type='text'
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className='mb-4 text-center text-2xl'
        placeholder='Enter number'
      />
      <div className='grid grid-cols-3 gap-2 mb-4'>
        {dialPadNumbers.map((num) => (
          <Button
            key={num}
            onClick={() => handleButtonClick(num)}
            className='h-12 text-xl'
          >
            {num}
          </Button>
        ))}
      </div>
      <div className='flex justify-between'>
        <Button onClick={handleBackspace} className='w-1/3' variant='outline'>
          ←
        </Button>
        <Button onClick={handleDial} className='w-2/3 ml-2'>
          Dial
        </Button>
      </div>
    </div>
  );
}
