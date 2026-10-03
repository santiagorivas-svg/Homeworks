import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
  const { user, logout } = useAuth();
  const { tasks, addTask, deleteTask, toggleTask, editTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (id) => {
    if (editingTitle.trim()) {
      editTask(id, editingTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="tasks-container">
      <header className="header">
        <h1>Mis Tareas</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={logout} className="logout-btn">Cerrar sesión</button>
        </div>
      </header>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            {editingId === task.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleTask(task.id)}>{task.title}</span>
            )}

            <div className="actions">
              <button onClick={() => startEdit(task)}>Editar</button>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}