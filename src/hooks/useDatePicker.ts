'use client';

import { useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import {
  IUseDatePickerProps,
  IUseDatePickerReturn,
} from '@/types/datePicker.types';

export type { IUseDatePickerProps, IUseDatePickerReturn };

/**
 * Safely parse a date string (YYYY-MM-DD) or Date object into a local Date instance
 * using moment.js to prevent timezone discrepancies.
 */
export function parseLocalDate(val?: string | Date | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : val;
  }
  if (typeof val === 'string') {
    const m = moment(val.split('T')[0], ['YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true);
    if (m.isValid()) {
      return m.toDate();
    }
    const fallback = moment(val);
    return fallback.isValid() ? fallback.toDate() : undefined;
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
        onChange(moment(date).format('YYYY-MM-DD'));
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
      onChange(moment().format('YYYY-MM-DD'));
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
