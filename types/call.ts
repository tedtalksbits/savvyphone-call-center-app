export type Call = {
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
};
