import { axiosInstance } from '@/lib/axios';
import { Account } from '@/types/account';
import { useState, useEffect } from 'react';
let NUM_TRIES = 0;
const MAX_TRIES = 5;
const useGetAccountsLive = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get<{
          accounts: Account[];
          message: string;
        }>('/accounts');
        setAccounts(response.data.accounts);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
    const interval = setInterval(fetchAccounts, 1000); // poll

    return () => clearInterval(interval);
  }, []);

  return { accounts, isLoading, error };
};
const useGetIsAccountAuthenticated = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let tries = 0;
        let isAuthenticated = false;

        while (tries < MAX_TRIES && !isAuthenticated) {
          const response = await axiosInstance.get<{
            accounts: Account[];
            message: string;
          }>('/accounts');

          if (response.data.accounts.length > 0) {
            isAuthenticated = response.data.accounts.some(
              (account) => account.active
            );
          }

          if (!isAuthenticated) {
            tries++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        setIsAuthenticated(isAuthenticated);
        if (!isAuthenticated) {
          setError('Failed to authenticate after maximum retries');
        }
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { isAuthenticated, isLoading, error };
};

const logoutAllAccount = async () => {
  try {
    await axiosInstance.post('/logout');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const logoutAccount = async (accountName: string) => {
  if (!accountName) throw new Error('account name is required');
  try {
    await axiosInstance.post(`/accounts/${accountName}/logout`);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export {
  useGetAccountsLive,
  logoutAllAccount,
  logoutAccount,
  useGetIsAccountAuthenticated,
};
