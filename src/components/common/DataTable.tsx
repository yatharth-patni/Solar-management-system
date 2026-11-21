import React from 'react';
import { EmptyState } from './EmptyState';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle,
  emptyDescription,
  emptyActionText,
  onEmptyAction,
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-7 h-7 border-2 border-[#9662AD] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#77727D]">Loading records...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#E7E5E9]/80 text-[#77727D] font-display font-medium text-[11px] uppercase tracking-wider bg-[#FAF9FB]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 first:pl-6 last:pr-6 ${col.className || ''} ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E5E9]/60 font-body">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="hover:bg-[#FBF9FD]/70 transition-colors group"
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-4 py-3.5 first:pl-6 last:pr-6 align-middle ${col.className || ''} ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.cell ? col.cell(item) : (col.accessor ? String(item[col.accessor]) : null)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
