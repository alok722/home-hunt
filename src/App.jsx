import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { ComparePage } from './pages/ComparePage';
import { useStore } from './store/useStore';

function PrivateRoute({ children }) {
  const user = useStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/projects" 
            element={
              <PrivateRoute>
                <ProjectListPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects/new" 
            element={
              <PrivateRoute>
                <ProjectFormPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects/:id/edit" 
            element={
              <PrivateRoute>
                <ProjectFormPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/compare" 
            element={
              <PrivateRoute>
                <ComparePage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
