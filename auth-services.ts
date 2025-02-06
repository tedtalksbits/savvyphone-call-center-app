import { axiosInstance } from './lib/axios';
import { Account } from './types/account';

export async function getUser() {
  return null;
}

export async function isSavvyPhoneRunning() {
  try {
    const response = await axiosInstance.get('http://localhost:6060/');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function isAccountActive() {
  try {
    const response = await axiosInstance.get<{
      accounts: Account[];
    }>('/accounts');
    return response.data.accounts.some((account) => account.active);
  } catch (error) {
    return false;
  }
}
