import React from 'react';

interface EditableFieldProps {
  fieldKey: string;
  label: string;
  onEditField?: (fieldKey: string, label: string) => void;
  className?: string;
  children: React.ReactNode;
}

export default function EditableField({ fieldKey, label, onEditField, className = '', children }: EditableFieldProps) {
  if (!onEditField) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onEditField(fieldKey, label);
      }}
      className={`inline-block group cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-amber-500 hover:bg-amber-400/10 hover:shadow-2xs p-0.5 rounded transition-all duration-150 relative ${className}`}
      title={`Click to edit: ${label}`}
    >
      {children}
      <span className="opacity-0 group-hover:opacity-100 absolute -top-4 -right-1 bg-amber-500 text-slate-950 font-sans font-black text-[8px] px-1.5 py-0.2 rounded-md shadow-sm uppercase tracking-wider select-none shrink-0 z-40 transition-opacity whitespace-nowrap pointer-events-none">
        ✏️ Edit {label}
      </span>
    </span>
  );
}
