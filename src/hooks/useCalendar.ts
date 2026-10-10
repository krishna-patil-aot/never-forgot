'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  CalendarViewMode,
  IUseCalendarProps,
  IUseCalendarReturn,
} from '@/types/datePicker.types';
import { parseToStartOfDay, parseToEndOfDay } from '@/lib/dateUtils';

const YEARS_PER_PAGE = 12;

export function useCalendar({
  selectedDate,
  minDate,
  maxDate,
  initialViewMode = 'days',
}: IUseCalendarProps): IUseCalendarReturn {
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode);

  const parsedMinDate = useMemo(() => parseToStartOfDay(minDate), [minDate]);
  const parsedMaxDate = useMemo(() => parseToEndOfDay(maxDate), [maxDate]);

  // Initialize display month from selectedDate or today
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Adjust displayMonth during render if selectedDate prop changes
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date | undefined>(selectedDate);
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }

  const currentYear = displayMonth.getFullYear();

  // Page offset relative to currentYear block (e.g., -12, 0, +12)
  const [pageBlockOffset, setPageBlockOffset] = useState<number>(0);
  const [prevYearTracked, setPrevYearTracked] = useState<number>(currentYear);
  if (currentYear !== prevYearTracked) {
    setPrevYearTracked(currentYear);
    setPageBlockOffset(0);
  }

  const baseBlock = Math.floor(currentYear / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  const yearRangeStart = baseBlock + pageBlockOffset;
  const yearRangeEnd = yearRangeStart + YEARS_PER_PAGE - 1;

  const goToYear = useCallback((year: number) => {
    setDisplayMonth((prev) => new Date(year, prev.getMonth(), 1));
    setViewMode('months');
  }, []);

  const goToMonth = useCallback((monthIndex: number) => {
    setDisplayMonth((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setViewMode('days');
  }, []);

  const goToDate = useCallback((date: Date) => {
    setDisplayMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setViewMode('days');
  }, []);

  const prevYearRange = useCallback(() => {
    setPageBlockOffset((prev) => prev - YEARS_PER_PAGE);
  }, []);

  const nextYearRange = useCallback(() => {
    setPageBlockOffset((prev) => prev + YEARS_PER_PAGE);
  }, []);

  const prevMonth = useCallback(() => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const nextMonth = useCallback(() => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const prevYear = useCallback(() => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1)
    );
  }, []);

  const nextYear = useCallback(() => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1)
    );
  }, []);

  const isYearDisabled = useCallback(
    (year: number): boolean => {
      if (parsedMinDate && year < parsedMinDate.getFullYear()) return true;
      if (parsedMaxDate && year > parsedMaxDate.getFullYear()) return true;
      return false;
    },
    [parsedMinDate, parsedMaxDate]
  );

  const isMonthDisabled = useCallback(
    (year: number, monthIndex: number): boolean => {
      if (parsedMinDate) {
        const minYear = parsedMinDate.getFullYear();
        const minMonth = parsedMinDate.getMonth();
        if (year < minYear || (year === minYear && monthIndex < minMonth)) {
          return true;
        }
      }
      if (parsedMaxDate) {
        const maxYear = parsedMaxDate.getFullYear();
        const maxMonth = parsedMaxDate.getMonth();
        if (year > maxYear || (year === maxYear && monthIndex > maxMonth)) {
          return true;
        }
      }
      return false;
    },
    [parsedMinDate, parsedMaxDate]
  );

  return {
    viewMode,
    displayMonth,
    yearRangeStart,
    yearRangeEnd,
    setViewMode,
    setDisplayMonth,
    goToYear,
    goToMonth,
    goToDate,
    prevYearRange,
    nextYearRange,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    isYearDisabled,
    isMonthDisabled,
  };
}
