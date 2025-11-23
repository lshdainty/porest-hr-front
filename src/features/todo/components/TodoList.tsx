import { useTodos } from '@/hooks/queries/useTodos';
import { useTodoContext } from '../contexts/TodoContext';

export const TodoList = () => {
  const { data: todos, isLoading, isError } = useTodos();
  const { filter, setFilter } = useTodoContext();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading todos!</div>;

  const filteredTodos = todos?.filter((todo) => 
    filter === 'all' ? true : todo.completed
  );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Todo List</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === 'completed' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <ul className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredTodos?.slice(0, 10).map((todo) => ( // Limit to 10 for demo
          <li 
            key={todo.id} 
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <input 
              type="checkbox" 
              checked={todo.completed} 
              readOnly 
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
            />
            <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-400 text-center pt-2">
        Showing top 10 results from JSONPlaceholder
      </div>
    </div>
  );
};
