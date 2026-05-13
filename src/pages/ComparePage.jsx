import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import fieldsConfig from '../config/fields.json';
import { ChevronLeft, Pencil } from 'lucide-react';

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projects = useStore(state => state.projects);
  
  const ids = searchParams.get('ids')?.split(',') || [];
  const selectedProjects = projects.filter(p => ids.includes(p.id));

  // Scoring logic
  const getScore = (project) => {
    let score = 0;
    let maxScore = 0;
    
    fieldsConfig.forEach(section => {
      section.fields.forEach(f => {
        const val = project.data[f.id];
        const isFilled = val !== undefined && val !== null && val !== '';
        
        if (f.tag === 'must') {
          maxScore += 3;
          if (isFilled) score += 3;
        } else if (f.tag === 'deal-breaker') {
          maxScore += 0; // doesn't add to max, just subtracts if failed
          if (f.type === 'boolean' && val === false) {
            score -= 5;
          } else if (!isFilled) {
            score -= 5;
          }
        } else {
          // non-must, non-deal-breaker
          if (f.type !== 'rating') maxScore += 1;
          if (isFilled && f.type !== 'rating') score += 1;
        }
      });
    });

    // Rating multiplier
    const rating = project.data.overall_rating ? parseInt(project.data.overall_rating, 10) : 0;
    score += (rating * 3);
    maxScore += (5 * 3);

    const percentage = Math.round((score / maxScore) * 100);
    return { score, maxScore, percentage };
  };

  if (selectedProjects.length === 0) {
    return <div className="p-8 text-center">No projects selected for comparison.</div>;
  }

  const renderCellContent = (field, project) => {
    const val = project.data[field.id];
    if (val === undefined || val === null || val === '') return <span className="text-slate-300">—</span>;
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return val.toString();
  };

  const getCellColor = (field, project) => {
    const val = project.data[field.id];
    const isFilled = val !== undefined && val !== null && val !== '';

    if (field.tag === 'deal-breaker') {
      if (field.type === 'boolean' && val === false) return 'bg-danger/10 text-danger font-medium';
      if (!isFilled) return 'bg-danger/10 text-danger font-medium';
    }

    if (field.tag === 'must' && isFilled) {
      if (field.type === 'boolean' && val === true) return 'bg-success/10 text-success font-medium';
      if (field.type !== 'boolean') return 'bg-success/10 text-success font-medium';
    }

    return 'text-slate-800';
  };

  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 70) return 'bg-success text-white';
    if (percentage >= 40) return 'bg-warning text-white';
    return 'bg-danger text-white';
  };

  return (
    <div className="bg-mesh min-h-screen">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center text-slate-600 hover:text-slate-900 font-medium min-h-[44px] px-2 -ml-2 rounded"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="ml-2 text-lg font-bold text-slate-900">Compare Projects</h1>
      </header>

      <main className="p-4 overflow-x-auto pb-24 max-w-6xl mx-auto">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead className="sticky top-[68px] z-20 bg-background shadow-sm">
            <tr>
              <th className="w-[140px] md:w-[240px] sticky left-0 bg-background/95 backdrop-blur z-30 p-2 border-b border-slate-200"></th>
              {selectedProjects.map(p => {
                const { percentage } = getScore(p);
                return (
                  <th key={p.id} className="min-w-[160px] w-1/4 p-2 border-b border-slate-200 align-top">
                    <div className="bg-surface border border-slate-200 rounded-lg p-3 relative shadow-sm text-left font-normal mx-auto max-w-xs">
                      <Link to={`/projects/${p.id}/edit`} className="absolute top-2 right-2 text-slate-400 hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <h3 className="font-bold text-slate-900 truncate pr-6 mb-2">{p.name}</h3>
                      <div className="flex flex-col gap-1 text-xs text-slate-600 mb-3">
                        <span className="truncate">{p.data.config_type || '—'}</span>
                        <span className="font-semibold text-slate-900">₹{p.data.total_cost_lakhs || '—'} L</span>
                      </div>
                      <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${getScoreBadgeColor(percentage)}`}>
                        Score: {percentage}%
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {fieldsConfig.map(section => (
              <React.Fragment key={section.section}>
                <tr>
                  <th colSpan={selectedProjects.length + 1} className="text-left pt-8 pb-3 px-2 border-b-2 border-slate-800 text-lg font-bold text-slate-900">
                    {section.section}
                  </th>
                </tr>
                {section.fields.map(field => (
                  <tr key={field.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-medium text-slate-700 w-[140px] md:w-[240px] sticky left-0 bg-background/95 backdrop-blur z-10 border-r border-slate-200 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                      {field.label}
                    </td>
                    {selectedProjects.map(p => (
                      <td key={p.id} className={`py-3 px-4 min-w-[160px] w-1/4 border-r border-slate-100 text-center md:text-left ${getCellColor(field, p)}`}>
                        {renderCellContent(field, p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
