/* 
  useSuspenseQuery 사용 시 suspense가 없으면 네트워크 무한 요청 오류 발생
  https://github.com/TanStack/query/issues/6116
*/

'use client';

import { QueryClient, QueryCache, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from '@/components/alert/toast'

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: error => toast.error(error.message),
    }),
  });
}

let clientQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientQueryClient) clientQueryClient = makeQueryClient();
    return clientQueryClient;
  }
}

export const CustomQueryClientProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};