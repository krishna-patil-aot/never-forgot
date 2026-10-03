'use client';

import * as React from 'react';
import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
  value?: string | Date | null;
  onChange?: (dateString: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Safely parse a date string (YYYY-MM-DD) or Date object into a local Date instance
 * to avoid timezone shifts.
 */
function parseLocalDate(val?: string | Date | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isValid(val) ? val : undefined;
  }
  if (typeof val === 'string') {
    const parts = val.split('T')[0].split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
      return isValid(parsed) ? parsed : undefined;
    }
    const d = new Date(val);
    return isValid(d) ? d : undefined;
  }
  return undefined;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
  id,
  clearable = true,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseLocalDate(value), [value]);

  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!onChange) return;
      if (date) {
        onChange(format(date, 'yyyy-MM-dd'));
      } else {
        onChange('');
      }
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onChange) {
        onChange('');
      }
    },
    [onChange]
  );

  const handleToday = React.useCallback(() => {
    if (onChange) {
      onChange(format(new Date(), 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  }, [onChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal h-9 px-3 text-sm bg-white hover:bg-slate-50 border-input shadow-2xs transition-colors',
            !selectedDate && 'text-slate-400',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
          <span className="flex-1 truncate">
            {selectedDate ? format(selectedDate, 'PPP') : placeholder}
          </span>
          {clearable && selectedDate && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  if (onChange) {
                    onChange('');
                  }
                }
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear date"
              aria-label="Clear date"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-1.5rem)] p-0 rounded-2xl border border-slate-200 bg-white shadow-xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="text-xs h-7 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium cursor-pointer"
          >
            Today
          </Button>
          {selectedDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(undefined)}
              className="text-xs h-7 px-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
