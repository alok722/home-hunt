import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      projects: [],
      setUser: (user) => set({ user }),
      setProjects: (projects) => set({ projects }),
      upsertProject: (project) => set((state) => {
        const exists = state.projects.find((p) => p.id === project.id);
        if (exists) {
          return {
            projects: state.projects.map((p) =>
              p.id === project.id ? project : p
            ),
          };
        }
        return {
          projects: [project, ...state.projects],
        };
      }),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),
      logout: () => set({ user: null, projects: [] }),
    }),
    {
      name: 'flat-hunt-storage',
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
);
