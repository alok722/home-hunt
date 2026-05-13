import { Pencil, Trash2, AlertTriangle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import fieldsConfig from '../config/fields.json';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onCompareToggle?: (id: string) => void;
  isCompareSelected?: boolean;
  onDelete?: (id: string) => void;
  isCompareMode?: boolean;
}

export function ProjectCard({ project, onCompareToggle, isCompareSelected, onDelete, isCompareMode }: ProjectCardProps) {
  const { name, data } = project;
  
  const config = data.config_type || 'N/A';
  const area = data.carpet_area ? `${data.carpet_area} sq ft` : 'N/A';
  const cost = data.total_cost_lakhs ? `₹${data.total_cost_lakhs} L` : 'N/A';
  const rating = data.overall_rating ? parseInt(data.overall_rating, 10) : 0;
  
  let totalFields = 0;
  let filledFields = 0;
  let dealBreakersFlagged = false;

  fieldsConfig.forEach(section => {
    section.fields.forEach(f => {
      totalFields++;
      const val = data[f.id];
      const isFilled = val !== undefined && val !== null && val !== '';
      if (isFilled) filledFields++;

      if (f.tag === 'deal-breaker') {
        if (f.type === 'boolean' && val === false) {
          dealBreakersFlagged = true;
        } else if (!isFilled) {
          dealBreakersFlagged = true;
        }
      }
    });
  });

  const progressPercent = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg p-4 mb-4 shadow-sm relative transition-all">
      {isCompareMode && (
        <div className="absolute top-4 right-4 z-10">
          <input 
            type="checkbox" 
            className="w-6 h-6 text-primary rounded border-slate-300 focus:ring-primary"
            checked={isCompareSelected}
            onChange={() => onCompareToggle?.(project.id)}
          />
        </div>
      )}

      {dealBreakersFlagged && (
        <div className="flex items-center gap-2 bg-danger/10 text-danger px-3 py-2 rounded-md mb-3 text-sm font-semibold">
          <AlertTriangle className="w-4 h-4" />
          Deal-breaker warning
        </div>
      )}

      <div className={isCompareMode ? "pr-10" : ""}>
        <h3 className="text-xl font-bold text-slate-900 mb-3 truncate">{name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-sm font-medium">{config}</span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-sm font-medium">{area}</span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-sm font-medium">{cost}</span>
        </div>

        {rating > 0 && (
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`w-4 h-4 ${s <= rating ? 'fill-warning text-warning' : 'text-slate-300'}`} 
              />
            ))}
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{filledFields} / {totalFields} fields</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {!isCompareMode && (
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <Link 
              to={`/projects/${project.id}/edit`}
              className="flex-1 flex items-center justify-center gap-2 py-2 min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-700 rounded font-medium transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <button 
              onClick={() => onDelete?.(project.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 min-h-[44px] bg-danger/5 hover:bg-danger/10 text-danger rounded font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
