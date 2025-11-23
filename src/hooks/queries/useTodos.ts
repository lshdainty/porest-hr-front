import { getTodos } from '@/lib/api/todo';
import { useQuery } from '@tanstack/react-query';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
