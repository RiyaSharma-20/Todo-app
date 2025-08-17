import React, { useState, useEffect } from 'react';
import './App.css';
import TodoItem from './components/TodoItem';
import AddTodo from './components/AddTodo';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('reactTodos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('reactTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, dueDate) => {
    const newTodo = {
      id: Date.now(),
      text,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // Filter todos based on completion status
  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'completed':
        return filtered.filter(todo => todo.completed);
      case 'pending':
        return filtered.filter(todo => !todo.completed);
      default:
        return filtered;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Todo App 📝</h1>
          <div className="todo-stats">
            <span className="stat-item">
              {completedCount} of {totalCount} completed
            </span>
          </div>
        </header>

        <AddTodo onAdd={addTodo} />

        <div className="todo-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({todos.filter(todo => !todo.completed).length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No todos found</h3>
              <p>
                {searchTerm
                  ? `No todos match "${searchTerm}"`
                  : filter === 'completed'
                  ? 'No completed todos yet'
                  : filter === 'pending'
                  ? 'No pending todos'
                  : 'Add a todo to get started!'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;