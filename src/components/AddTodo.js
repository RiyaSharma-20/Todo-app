import React, { useState, useRef } from 'react';
import './AddTodo.css';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const textInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), dueDate);
      setText('');
      setDueDate('');
      textInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="input-group">
        <input
          ref={textInputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your todo..."
          className="todo-input"
          autoFocus
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
        />

        <button type="submit" className="add-btn" disabled={!text.trim()}>
          Add Todo
        </button>
      </div>
    </form>
  );
};

export default AddTodo;