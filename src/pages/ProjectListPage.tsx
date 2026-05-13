import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchProjects, deleteProject } from '../lib/supabase';
import { ProjectCard } from '../components/ProjectCard';
import { Plus, ArrowRightLeft, LogOut, Home } from 'lucide-react';

export function ProjectListPage() {
  const user = useStore((state) => state.user);
  const projects = useStore((state) => state.projects);
  const setProjects = useStore((state) => state.setProjects);
  const removeProject = useStore((state) => state.deleteProject);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await fetchProjects(user.id);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user, setProjects]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      removeProject(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 relative">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hi, {user?.username}</h1>
          <button onClick={handleLogout} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-0.5 font-medium transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Not you?
          </button>
        </div>
        {projects.length > 1 && (
          <button 
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (isCompareMode) setSelectedForCompare([]);
            }}
            className={`px-4 py-2 min-h-[44px] rounded font-semibold transition-colors ${isCompareMode ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            {isCompareMode ? 'Cancel' : 'Compare'}
          </button>
        )}
      </header>

      <main className="p-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-slate-200 rounded-lg h-48 w-full"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 px-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Add your first project to start evaluating and comparing.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {projects.map((p) => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onDelete={handleDelete}
                isCompareMode={isCompareMode}
                isCompareSelected={selectedForCompare.includes(p.id)}
                onCompareToggle={handleCompareToggle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button / Compare Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-20">
        <div className="max-w-3xl mx-auto flex justify-center pointer-events-auto">
          {isCompareMode ? (
            <button
              onClick={() => navigate(`/compare?ids=${selectedForCompare.join(',')}`)}
              disabled={selectedForCompare.length < 2 || selectedForCompare.length > 4}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 py-3.5 min-h-[48px] flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:scale-100 transition-all active:scale-95"
            >
              <ArrowRightLeft className="w-5 h-5" />
              Compare {selectedForCompare.length > 0 && `(${selectedForCompare.length})`}
            </button>
          ) : (
            <button
              onClick={() => navigate('/projects/new')}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 py-3.5 min-h-[48px] flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
