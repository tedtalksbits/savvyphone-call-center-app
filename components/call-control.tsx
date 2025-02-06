'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Contact,
  ContactIcon,
  HeadphoneOffIcon,
  HeadphonesIcon,
  KeyboardIcon,
  MicIcon,
  MicOff,
  MicOffIcon,
  PauseCircleIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlayCircleIcon,
  SpeakerIcon,
  X,
} from 'lucide-react';
import { format, formatDuration } from 'date-fns';
import DialPad from './dial-pad';

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
  callerId: string;
}

export default function CallControl() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(calls[0]);
  const [muteStatus, setMuteStatus] = useState<boolean>(false);
  const [dialNumber, setDialNumber] = useState('');
  const [showDialPad, setShowDialPad] = useState(false);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch('http://localhost:6060/calls');
        if (response.ok) {
          const data = await response.json();
          setCalls(data.calls || []);
          // set selected call to the call that is not on hold
          setSelectedCall(
            data.calls.find((call: Call) => call.hold !== 'LOCAL_HOLD') || null
          );
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
      <div className='flex space-x-2 items-center justify-between'>
        <Input
          className='w-1/3'
          type='text'
          value={dialNumber}
          onChange={(e) => setDialNumber(e.target.value)}
          placeholder='Enter number to dial'
        />
        <div className='flex space-x-2 items-center justify-end'>
          <Button onClick={handleDial}>Dial</Button>
          <Button onClick={handleMute} size='icon' variant='outline'>
            {muteStatus ? (
              <MicOff className='text-destructive' />
            ) : (
              <MicIcon className='text-foreground/50' />
            )}
          </Button>
        </div>
      </div>
      <div className='space-y-2'>
        {calls.length === 0 && <div>No active calls</div>}
        {calls.map((call) => (
          <div
            key={call.id}
            onClick={() => setSelectedCall(call)}
            className={cn('p-4 rounded-lg bg-secondary cursor-default', {
              'bg-secondary/90 text-secondary-foreground':
                call.state === 'DISCONNCTD',
              'bg-secondary text-card-foreground': call.state === 'CONFIRMED',
            })}
          >
            <div className='flex justify-between items-center'>
              <p className='font-semibold'>
                Unkown Caller{' '}
                <span className='text-xs text-foreground/50'>
                  ({call.state})
                </span>
              </p>
              {/* the call start time is today - duration */}
              {/* display call start time */}
              <span className='text-xs text-foreground/50'>
                {format(new Date(Date.now() - call.duration * 1000), 'hh:mm a')}
              </span>
            </div>
            <div className='flex items-center space-x-2 text-xl'>
              {call.direction === 'OUTGOING' ? (
                <ArrowUpRight className='text-foreground/50' />
              ) : (
                <ArrowDownLeft className='text-green-500' />
              )}
              <span>{call.callerId}</span>
            </div>
            {/* <span>{call.hold}</span> */}

            <div className='controls flex space-x-2 items-center justify-end'>
              {call.state === 'INCOMING' && (
                <Button onClick={() => handleAnswer(call.id)}>Answer</Button>
              )}
              <Button
                onClick={() => handleHangup(call.id)}
                variant='destructive'
              >
                <PhoneIcon className='rotate-[135deg]' />
              </Button>
              <Button
                variant={call.hold === 'LOCAL_HOLD' ? 'outline' : 'ghost'}
                onClick={() => handleHold(call.id, call.hold === 'LOCAL_HOLD')}
              >
                {call.hold === 'LOCAL_HOLD' ? (
                  <>
                    <PlayCircleIcon />
                  </>
                ) : (
                  <>
                    <PauseCircleIcon />
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* floating call control tray */}
      {selectedCall && (
        <div className='fixed bottom-4 left-0 w-full'>
          <div className='flex justify-between items-center px-6 py-4 bg-secondary text-secondary-foreground min-w-fit max-w-[600px] mx-auto rounded-3xl gap-4'>
            <span className='text-2xl font-semibold tabular-nums font-mono'>
              {formatSeconds(selectedCall.duration)}
            </span>
            <span>+{selectedCall.callerId}</span>
            <div className='bg-card flex-1 rounded-xl px-4 py-2'>
              <div className='flex items-center justify-evenly'>
                <Button
                  variant={
                    selectedCall.hold === 'LOCAL_HOLD' ? 'outline' : 'ghost'
                  }
                  onClick={() =>
                    handleHold(
                      selectedCall.id,
                      selectedCall.hold === 'LOCAL_HOLD'
                    )
                  }
                >
                  {selectedCall.hold === 'LOCAL_HOLD' ? (
                    <>
                      <PlayCircleIcon />
                      Unhold
                    </>
                  ) : (
                    <>
                      <PauseCircleIcon />
                      Hold
                    </>
                  )}
                </Button>
                <Button
                  variant={muteStatus ? 'outline' : 'ghost'}
                  onClick={handleMute}
                >
                  {muteStatus ? (
                    <>
                      <MicOffIcon />
                      Unmute
                    </>
                  ) : (
                    <>
                      <MicIcon />
                      Mute
                    </>
                  )}
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => setShowDialPad(!showDialPad)}
                >
                  <KeyboardIcon />
                  Keypad
                </Button>
                <Button variant='ghost'>
                  <ContactIcon />
                  Contacts
                </Button>
              </div>
            </div>
            <Button
              onClick={() => handleHangup(selectedCall.id)}
              variant='destructive'
            >
              <PhoneIcon className='rotate-[135deg]' />
            </Button>
          </div>
          {showDialPad && (
            <div className='absolute bottom-20 left-1/2 -translate-x-1/2'>
              <div className='w-[400px] bg-secondary rounded-lg p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold'>Dial Pad</h2>
                  <Button
                    onClick={() => setShowDialPad(false)}
                    variant='ghost'
                    size='icon'
                  >
                    <X />
                  </Button>
                </div>
                <DialPad onDial={(number) => setDialNumber(number)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatSeconds(seconds: number) {
  // Convert seconds to milliseconds and create a new Date object
  const date = new Date(seconds * 1000);
  // Format the date as mm:ss
  return format(date, 'mm:ss');
}
