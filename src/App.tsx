import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { ComparePage } from './pages/ComparePage';
import { useStore } from './store/useStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

import { AnimatedGridPattern } from './components/AnimatedGridPattern';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background relative">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.15}
          duration={3}
          repeatDelay={1}
          className="fixed inset-x-0 top-[-50vh] h-[200vh] w-[100vw] [mask-image:radial-gradient(800px_circle_at_center,white,transparent)] skew-y-12"
        />
        <div className="relative z-10">
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
      </div>
    </BrowserRouter>
  );
}

export default App;
