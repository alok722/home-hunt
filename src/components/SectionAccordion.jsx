import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function SectionAccordion({ title, icon: Icon, completedCount, totalCount, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface rounded border border-slate-200 mb-3 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-surface hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {completedCount}/{totalCount}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100">
          <div className="flex flex-col gap-5 mt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
