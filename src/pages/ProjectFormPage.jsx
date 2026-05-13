import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { saveProject } from '../lib/supabase';
import fieldsConfig from '../config/fields.json';
import { SectionAccordion } from '../components/SectionAccordion';
import { FieldRenderer } from '../components/FieldRenderer';
import { ChevronLeft, LayoutGrid, DoorOpen, Building2, Building, Waves, MapPin, FileBadge, NotebookPen } from 'lucide-react';

const ICONS = {
  LayoutGrid, DoorOpen, Building2, Building, Waves, MapPin, FileBadge, NotebookPen
};

export function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const projects = useStore(state => state.projects);
  const upsertProject = useStore(state => state.upsertProject);

  const isEdit = !!id;
  const existingProject = isEdit ? projects.find(p => p.id === id) : null;

  const [projectId, setProjectId] = useState(id);
  const [saveStatus, setSaveStatus] = useState('');
  const saveTimeout = useRef(null);

  const { control, register, watch } = useForm({
    defaultValues: {
      name: existingProject?.name || '',
      data: existingProject?.data || {}
    }
  });

  const formValues = watch();
  const nameValue = watch('name');

  useEffect(() => {
    if (!nameValue.trim()) return;
    
    setSaveStatus('saving');
    
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    saveTimeout.current = setTimeout(async () => {
      try {
        const payload = {
          name: formValues.name,
          data: formValues.data,
          user_id: user.id,
        };
        
        if (projectId) {
          payload.id = projectId;
        }

        const savedProject = await saveProject(payload);
        
        if (!projectId && savedProject.id) {
          setProjectId(savedProject.id);
          // Navigate replace to the edit URL so refresh works
          window.history.replaceState(null, '', `/projects/${savedProject.id}/edit`);
        }
        
        upsertProject(savedProject);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error(err);
        setSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(saveTimeout.current);
  }, [JSON.stringify(formValues), nameValue, projectId, user.id, upsertProject]);

  return (
    <div className="bg-mesh min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center text-slate-600 hover:text-slate-900 font-medium min-h-[44px] px-2 -ml-2 rounded"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div className="text-sm font-medium">
          {saveStatus === 'saving' && <span className="text-slate-500">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-success">Saved ✓</span>}
          {saveStatus === 'error' && <span className="text-danger">Save failed</span>}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <div className="mb-6">
          <label className="sr-only">Project Name</label>
          <input 
            type="text" 
            placeholder="Enter Project Name"
            className="w-full text-3xl font-bold bg-transparent border-none placeholder:text-slate-300 focus:outline-none focus:ring-0 px-0"
            {...register('name')}
            autoFocus={!isEdit}
          />
        </div>

        {fieldsConfig.map((section, idx) => {
          const Icon = ICONS[section.icon];
          const totalFields = section.fields.length;
          const completedFields = section.fields.filter(f => {
            const val = formValues.data?.[f.id];
            return val !== undefined && val !== null && val !== '';
          }).length;

          return (
            <SectionAccordion 
              key={section.section}
              title={section.section}
              icon={Icon}
              completedCount={completedFields}
              totalCount={totalFields}
              defaultOpen={idx === 0}
            >
              {section.fields.map(field => (
                <FieldRenderer 
                  key={field.id}
                  field={field}
                  control={control}
                />
              ))}
            </SectionAccordion>
          );
        })}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-20">
        <div className="max-w-3xl mx-auto flex justify-end pointer-events-auto">
          <button
            onClick={() => navigate('/projects')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-8 py-3.5 min-h-[48px] shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Save & Back
          </button>
        </div>
      </div>
    </div>
  );
}
