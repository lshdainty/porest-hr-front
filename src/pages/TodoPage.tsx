import { TodoList } from '@/features/todo/components/TodoList';
import { TodoProvider } from '@/features/todo/contexts/TodoContext';

const TodoPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Feature-based Architecture Demo</h1>
      
      {/* 
        Provider Injection:
        The page is responsible for injecting the necessary context providers.
        This keeps the feature components pure and reusable.
      */}
      <TodoProvider>
        <TodoList />
      </TodoProvider>
      
      <div className="mt-8 text-center text-gray-500">
        <p>This page demonstrates the separation of concerns:</p>
        <ul className="list-disc inline-block text-left mt-2">
          <li><strong>API:</strong> src/features/todo/api</li>
          <li><strong>Hooks:</strong> src/features/todo/hooks</li>
          <li><strong>Context:</strong> src/features/todo/contexts</li>
          <li><strong>Components:</strong> src/features/todo/components</li>
        </ul>
      </div>
    </div>
  );
};

export { TodoPage };
