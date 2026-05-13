import { Controller } from 'react-hook-form';
import { TagBadge } from './TagBadge';
import { Star } from 'lucide-react';

export function FieldRenderer({ field, control }) {
  const { id, label, type, options, placeholder, note, tag } = field;

  const renderInput = (fieldProps) => {
    switch (type) {
      case 'boolean':
        return (
          <label className="flex items-center justify-between gap-4 py-2 cursor-pointer min-h-[52px] group">
            <span className="text-[16px] text-slate-800 font-medium leading-snug flex-1 pr-2">{label} {tag && <TagBadge type={tag} />}</span>
            <div className="relative shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!fieldProps.value}
                onChange={(e) => fieldProps.onChange(e.target.checked)}
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-success"></div>
            </div>
          </label>
        );
      
      case 'select':
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <select
              className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
            >
              <option value="" disabled>Select option</option>
              {options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case 'number':
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder={placeholder}
              className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
            />
          </div>
        );

      case 'text':
      case 'date':
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <input
              type={type}
              placeholder={placeholder}
              className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <textarea
              placeholder={placeholder}
              rows={3}
              className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
            />
          </div>
        );

      case 'dimension': {
        const valStr = fieldProps.value || '';
        const [l, w] = valStr.split('x').map(s => s.trim());
        
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="L"
                className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={l || ''}
                onChange={(e) => {
                  const newL = e.target.value;
                  fieldProps.onChange(`${newL} x ${w || ''}`);
                }}
              />
              <span className="text-slate-500 font-medium">×</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="W"
                className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 text-slate-900 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={w || ''}
                onChange={(e) => {
                  const newW = e.target.value;
                  fieldProps.onChange(`${l || ''} x ${newW}`);
                }}
              />
            </div>
          </div>
        );
      }

      case 'rating': {
        const currentRating = parseInt(fieldProps.value || '0', 10);
        return (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-800">{label} {tag && <TagBadge type={tag} />}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => fieldProps.onChange(s.toString())}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${s <= currentRating ? 'fill-warning text-warning' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>
        );
      }

      default:
        return <div className="text-danger text-sm">Unsupported field type: {type}</div>;
    }
  };

  return (
    <div className="flex flex-col mb-2">
      <Controller
        name={`data.${id}`}
        control={control}
        render={({ field: fieldProps }) => (
          <>
            {renderInput(fieldProps)}
            {type !== 'boolean' && note && (
              <p className="text-xs text-slate-500 mt-1">{note}</p>
            )}
            {type === 'boolean' && note && (
              <p className="text-xs text-slate-500 mt-1 pr-16">{note}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
