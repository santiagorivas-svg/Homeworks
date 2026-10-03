import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./challenge-7/context/AuthContext";
import { TaskProvider } from "./challenge-7/context/TaskContext";
import { ProtectedRoute } from "./challenge-7/components/ProtectedRoute";
import Login from "./challenge-7/pages/Login";
import Register from "./challenge-7/pages/Register";
import TasksPage from "./challenge-7/pages/TasksPage";
import "./challenge-7/styles/main.scss";

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}