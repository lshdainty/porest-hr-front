import { api } from '@/lib/api';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const getTodos = async (): Promise<Todo[]> => {
  // Using jsonplaceholder for demo, but api instance is configured for internal API.
  // For this demo to work with the existing 'api' instance (which might have a base URL set),
  // we might need to override baseURL or just assume this is a real internal endpoint.
  // However, since the user wants to use the existing 'api' instance, I should try to use it.
  // But 'api' instance has interceptors and base URL from config.
  // If I want to keep the demo working with jsonplaceholder, I might need to use a full URL
  // or temporarily create a separate instance if 'api' is strictly for the backend.
  //
  // User said: "axios.ts is same as api.ts, use api.ts".
  // 'api.ts' has baseURL from config.
  //
  // Let's assume for the "Architecture Demo" we want to show how it *should* work in this project.
  // So I will use `api.get('/todos')`. If it fails because of the real backend, that's expected
  // as this is a structural demo. But to make it "runnable" as I promised, I should probably
  // keep the jsonplaceholder URL but maybe pass it as a full URL if axios supports it?
  // Axios supports full URL overriding baseURL.
  
  return await api.get('https://jsonplaceholder.typicode.com/todos');
};
