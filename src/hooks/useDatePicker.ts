'use client';

import { useState, useMemo, useCallback } from 'react';
import { format, isValid } from 'date-fns';

export interface IUseDatePickerProps {
  value?: string | Date | null;
  onChange?: (dateString: string) => void;
}

export interface IUseDatePickerReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
  handleClear: (e: React.MouseEvent) => void;
  handleToday: () => void;
}

/**
 * Safely parse a date string (YYYY-MM-DD) or Date object into a local Date instance
 * to avoid timezone shifts.
 */
export function parseLocalDate(val?: string | Date | null): Date | undefined {
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

export function useDatePicker({ value, onChange }: IUseDatePickerProps): IUseDatePickerReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedDate = useMemo(() => parseLocalDate(value), [value]);

  const handleSelect = useCallback(
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

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onChange) {
        onChange('');
      }
    },
    [onChange]
  );

  const handleToday = useCallback(() => {
    if (onChange) {
      onChange(format(new Date(), 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  }, [onChange]);

  return {
    isOpen,
    setIsOpen,
    selectedDate,
    handleSelect,
    handleClear,
    handleToday,
  };
}
