'use client';

import * as React from 'react';
import moment from 'moment';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDatePicker } from '@/hooks/useDatePicker';
import { IDatePickerProps } from '@/types/datePicker.types';

export type { IDatePickerProps as DatePickerProps };

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
}: IDatePickerProps) {
  const {
    isOpen,
    setIsOpen,
    selectedDate,
    handleSelect,
    handleClear,
    handleToday,
  } = useDatePicker({ value, onChange });

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
          <CalendarIcon className="mr-2 h-4 w-4 text-cyan-600 shrink-0" />
          <span className="flex-1 truncate">
            {selectedDate ? moment(selectedDate).format('ll') : placeholder}
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
        className="w-auto max-w-[calc(100vw-1.5rem)] p-0 rounded-2xl border border-slate-200 bg-white shadow-xl z-[70]"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
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
            className="text-xs h-7 px-2.5 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 font-medium cursor-pointer"
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
