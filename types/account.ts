export type AccountStatus = 'Unauthorized' | 'Request Timeout' | 'Ok' | string;
export type Account = {
  active: boolean;
  id: number;
  name: string;
  status: AccountStatus;
  uri: string;
};
