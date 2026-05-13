import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getOrCreateUser } from '../lib/supabase';
import { Building } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const user = await getOrCreateUser(username.trim());
      setUser(user);
      navigate('/projects');
    } catch (error) {
      console.error('Login failed', error);
      alert('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Flat Hunt</h1>
        <p className="text-slate-500 mb-8">Evaluate and compare properties</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="What's your name?"
            className="w-full px-4 py-4 text-lg rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center font-medium placeholder:font-normal placeholder:text-slate-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Entering...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
