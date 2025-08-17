import React, { useState, useRef, useEffect } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!todo.dueDate) return false;
    const today = new Date();
    const due = new Date(todo.dueDate);
    return due < today && !todo.completed;
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div
          className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed && '✓'}
        </div>

        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="todo-text editing"
          />
        ) : (
          <div className="todo-text">{todo.text}</div>
        )}

        {todo.dueDate && (
          <div className={`todo-date ${isOverdue() ? 'overdue' : ''}`}>
            {isOverdue() && '⚠️ '}
            {formatDate(todo.dueDate)}
          </div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="action-btn save-btn">
              ✓
            </button>
            <button onClick={handleCancel} className="action-btn cancel-btn">
              ✕
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="action-btn edit-btn">
              ✏️
            </button>
            <button onClick={() => onDelete(todo.id)} className="action-btn delete-btn">
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;