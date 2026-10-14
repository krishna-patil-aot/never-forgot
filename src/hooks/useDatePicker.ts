'use client';

import { useState, useMemo, useCallback } from 'react';
import { format, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';
import {
  IUseDatePickerProps,
  IUseDatePickerReturn,
} from '@/types/datePicker.types';
import { parseToStartOfDay, parseToEndOfDay, parseDateSafe } from '@/lib/dateUtils';

export type { IUseDatePickerProps, IUseDatePickerReturn };

/**
 * Safely parse a date string (YYYY-MM-DD) or Date object into a local Date instance
 * to prevent timezone discrepancies.
 */
export function parseLocalDate(val?: string | Date | null): Date | undefined {
  if (!val) return undefined;
  const parsed = parseDateSafe(val);
  return parsed ?? undefined;
}

export function useDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
}: IUseDatePickerProps): IUseDatePickerReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedDate = useMemo(() => parseLocalDate(value), [value]);

  const minBoundary = useMemo(() => parseToStartOfDay(minDate), [minDate]);
  const maxBoundary = useMemo(() => parseToEndOfDay(maxDate), [maxDate]);

  const isTodayDisabled = useMemo(() => {
    const today = startOfDay(new Date());
    if (minBoundary && isBefore(today, startOfDay(minBoundary))) {
      return true;
    }
    if (maxBoundary && isAfter(today, endOfDay(maxBoundary))) {
      return true;
    }
    return false;
  }, [minBoundary, maxBoundary]);

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
    if (isTodayDisabled) return;
    if (onChange) {
      onChange(format(new Date(), 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  }, [onChange, isTodayDisabled]);

  return {
    isOpen,
    setIsOpen,
    selectedDate,
    handleSelect,
    handleClear,
    handleToday,
    isTodayDisabled,
  };
}
