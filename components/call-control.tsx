'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { HeadphoneOffIcon, HeadphonesIcon, SpeakerIcon } from 'lucide-react';

interface Call {
  id: string;
  state: 'CONFIRMED' | 'DISCONNCTD' | string;
  remote_uri: string;
  direction: 'INCOMING' | 'OUTGOING' | string;
  party: string;
  sid: string;
  account: string;
  hold: 'LOCAL_HOLD' | 'NOT_IN_HOLD' | string;
  duration: number;
  displayName: string;
}

export default function CallControl() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [muteStatus, setMuteStatus] = useState<boolean>(false);
  const [dialNumber, setDialNumber] = useState('');

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch('http://localhost:6060/calls');
        if (response.ok) {
          const data = await response.json();
          setCalls(data.calls || []);
        }
      } catch (error) {
        console.error('Error fetching calls:', error);
      }
    };

    fetchCalls();
    const interval = setInterval(fetchCalls, 1000); // poll

    return () => clearInterval(interval);
  }, []);

  const handleDial = async () => {
    try {
      const response = await fetch('http://localhost:6060/dial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri: dialNumber }),
      });
      if (response.ok) {
        setDialNumber('');
      }
    } catch (error) {
      console.error('Error dialing:', error);
    }
  };

  const handleAnswer = async (callId: string) => {
    try {
      await fetch(`http://localhost:6060/calls/${callId}/answer`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const handleHangup = async (callId: string) => {
    try {
      await fetch(`http://localhost:6060/calls/${callId}/hangup`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error hanging up call:', error);
    }
  };

  const handleHangupAll = async () => {
    try {
      await fetch('http://localhost:6060/hangup_all', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error hanging up all calls:', error);
    }
  };

  const handleHold = async (callId: string, isHold: boolean) => {
    console.log('callId', callId);
    console.log('isHold', isHold);
    try {
      await fetch(`http://localhost:6060/calls/${callId}/hold`, {
        method: isHold ? 'DELETE' : 'PUT',
      });
    } catch (error) {
      console.error('Error toggling hold:', error);
    }
  };

  useEffect(() => {
    const fetchMuteStatus = async () => {
      /*
        ========================================
        GET /devices/mute
        ========================================
         response:
            {
                "data": {
                    "mute": false
                },
                "error": null,
                "message": "Success"
            }
      */
      try {
        const response = await fetch('http://localhost:6060/devices/mute');
        if (response.ok) {
          const res = await response.json();
          console.log('data', res);
          setMuteStatus(res.data.mute);
        }
      } catch (error) {
        console.error('Error fetching mute status:', error);
      }
    };

    fetchMuteStatus();
    const interval = setInterval(fetchMuteStatus, 500); // poll

    return () => clearInterval(interval);
  }, []);

  const handleMute = async () => {
    try {
      const response = await fetch('http://localhost:6060/devices/mute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mute: !muteStatus }),
      });
      if (response.ok) {
        setMuteStatus(!muteStatus);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex space-x-2'>
        <Input
          type='text'
          value={dialNumber}
          onChange={(e) => setDialNumber(e.target.value)}
          placeholder='Enter number to dial'
        />
        <Button onClick={handleDial}>Dial</Button>
        <Button
          onClick={handleMute}
          size='icon'
          variant={muteStatus ? 'destructive' : 'outline'}
        >
          {muteStatus ? (
            <HeadphoneOffIcon />
          ) : (
            <HeadphonesIcon className='text-primary' />
          )}
        </Button>
      </div>
      <Button
        className={cn('w-full', {
          hidden: !calls.length || calls.length === 0,
        })}
        onClick={handleHangupAll}
        variant='destructive'
      >
        Hang Up All Calls
      </Button>
      {/* <pre>{JSON.stringify(calls[0], null, 2)}</pre> */}
      <div className='space-y-2'>
        {calls.length === 0 && <div>No active calls</div>}
        {calls.map((call) => (
          <div
            key={call.id}
            className='flex items-center space-x-2 p-2 border rounded'
          >
            <span>{call.id}</span>
            <span>{call.account}</span>
            <span>{call.sid}</span>
            <span>{call.party}</span>
            <span>{call.direction}</span>
            <span>{call.hold}</span>
            <span>
              {call.remote_uri} - {call.state}
            </span>
            {call.state === 'INCOMING' && (
              <Button onClick={() => handleAnswer(call.id)}>Answer</Button>
            )}
            <Button onClick={() => handleHangup(call.id)} variant='destructive'>
              Hang Up
            </Button>
            <Button
              onClick={() => handleHold(call.id, call.hold === 'LOCAL_HOLD')}
            >
              {call.hold === 'LOCAL_HOLD' ? 'Unhold' : 'Hold'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
