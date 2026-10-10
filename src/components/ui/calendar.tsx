'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { DayPicker, getDefaultClassNames, type DayPickerProps } from 'react-day-picker';
import 'react-day-picker/style.css';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarViewMode } from '@/types/datePicker.types';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_FULL_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const QUICK_DECADES = [1980, 1990, 2000, 2010, 2020, 2030];

export type CalendarProps = DayPickerProps & {
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  initialViewMode?: CalendarViewMode;
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  minDate,
  maxDate,
  initialViewMode = 'days',
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const selectedDate = React.useMemo(() => {
    if ('selected' in props && props.selected instanceof Date) {
      return props.selected;
    }
    return undefined;
  }, [props]);

  const {
    viewMode,
    displayMonth,
    yearRangeStart,
    yearRangeEnd,
    setViewMode,
    setDisplayMonth,
    goToYear,
    goToMonth,
    prevYearRange,
    nextYearRange,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    isYearDisabled,
    isMonthDisabled,
  } = useCalendar({
    selectedDate,
    minDate,
    maxDate,
    initialViewMode,
  });

  const displayYear = displayMonth.getFullYear();
  const displayMonthIndex = displayMonth.getMonth();

  // Generate 12 years for the current decade block
  const yearsList = React.useMemo(() => {
    const list: number[] = [];
    for (let y = yearRangeStart; y <= yearRangeEnd; y++) {
      list.push(y);
    }
    return list;
  }, [yearRangeStart, yearRangeEnd]);

  return (
    <div className={cn('p-3 bg-white rounded-2xl w-[300px] select-none', className)}>
      {/* 1. Header Navigation Bar (Adaptive for Days / Months / Years) */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            if (viewMode === 'days') prevMonth();
            else if (viewMode === 'months') prevYear();
            else prevYearRange();
          }}
          className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shadow-2xs"
          aria-label={
            viewMode === 'days'
              ? 'Previous month'
              : viewMode === 'months'
              ? 'Previous year'
              : 'Previous 12 years'
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Center Header Controls */}
        <div className="flex items-center gap-1.5">
          {viewMode === 'days' && (
            <>
              {/* Click Month -> Switch to Months Selector */}
              <button
                type="button"
                onClick={() => setViewMode('months')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-800 hover:text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors cursor-pointer group"
                title="Click to select month"
              >
                <span>{MONTH_FULL_NAMES[displayMonthIndex]}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-cyan-600 transition-transform group-hover:translate-y-0.5" />
              </button>

              {/* Click Year -> Switch to Years Selector */}
              <button
                type="button"
                onClick={() => setViewMode('years')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-800 hover:text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors cursor-pointer group"
                title="Click to select year"
              >
                <span>{displayYear}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-cyan-600 transition-transform group-hover:translate-y-0.5" />
              </button>
            </>
          )}

          {viewMode === 'months' && (
            <button
              type="button"
              onClick={() => setViewMode('years')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors cursor-pointer group"
              title="Click to change year"
            >
              <span>{displayYear}</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-600 transition-transform group-hover:translate-y-0.5" />
            </button>
          )}

          {viewMode === 'years' && (
            <span className="text-xs font-bold text-slate-800 tracking-wide px-2 py-1">
              {yearRangeStart} – {yearRangeEnd}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            if (viewMode === 'days') nextMonth();
            else if (viewMode === 'months') nextYear();
            else nextYearRange();
          }}
          className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shadow-2xs"
          aria-label={
            viewMode === 'days'
              ? 'Next month'
              : viewMode === 'months'
              ? 'Next year'
              : 'Next 12 years'
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 2. Mode: YEARS GRID VIEW */}
      {viewMode === 'years' && (
        <div className="space-y-3 py-1">
          <div className="grid grid-cols-3 gap-2">
            {yearsList.map((year) => {
              const isSelected = selectedDate && selectedDate.getFullYear() === year;
              const isCurrent = new Date().getFullYear() === year;
              const disabled = isYearDisabled(year);

              return (
                <button
                  key={year}
                  type="button"
                  disabled={disabled}
                  onClick={() => goToYear(year)}
                  className={cn(
                    'h-10 text-xs font-semibold rounded-xl transition-all cursor-pointer border',
                    isSelected
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm font-bold'
                      : isCurrent
                      ? 'bg-cyan-50/70 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                      : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50 hover:border-slate-200',
                    disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* Quick Decade Jump Shortcuts */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 px-0.5">
              Quick Decades:
            </p>
            <div className="flex flex-wrap gap-1">
              {QUICK_DECADES.map((dec) => (
                <button
                  key={dec}
                  type="button"
                  onClick={() => goToYear(dec)}
                  className="text-[11px] px-2 py-0.5 font-medium rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                >
                  {dec}s
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Mode: MONTHS GRID VIEW */}
      {viewMode === 'months' && (
        <div className="space-y-3 py-1">
          <div className="grid grid-cols-3 gap-2">
            {MONTH_NAMES.map((name, idx) => {
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === displayYear &&
                selectedDate.getMonth() === idx;
              const isCurrent =
                new Date().getFullYear() === displayYear &&
                new Date().getMonth() === idx;
              const disabled = isMonthDisabled(displayYear, idx);

              return (
                <button
                  key={name}
                  type="button"
                  disabled={disabled}
                  onClick={() => goToMonth(idx)}
                  className={cn(
                    'h-10 text-xs font-semibold rounded-xl transition-all cursor-pointer border flex flex-col items-center justify-center',
                    isSelected
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm font-bold'
                      : isCurrent
                      ? 'bg-cyan-50/70 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                      : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50 hover:border-slate-200',
                    disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
                  )}
                >
                  <span>{name}</span>
                  <span className="text-[9px] font-normal opacity-70">
                    {MONTH_FULL_NAMES[idx].slice(0, 4)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode('years')}
              className="text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer"
            >
              ← Back to Years
            </button>
            <button
              type="button"
              onClick={() => setViewMode('days')}
              className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 4. Mode: DAYS CALENDAR VIEW */}
      {viewMode === 'days' && (
        <DayPicker
          {...props}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          showOutsideDays={showOutsideDays}
          className="w-full"
          classNames={{
            root: cn(defaultClassNames.root, 'select-none w-full'),
            months: 'flex flex-col relative',
            month: 'flex flex-col gap-2',
            month_caption: 'hidden', // Replaced by our unified header bar
            caption_label: 'hidden',
            nav: 'hidden', // Replaced by our unified header bar
            month_grid: 'w-full border-collapse space-y-1',
            weekdays: 'flex justify-between w-full mb-1 px-1',
            weekday:
              'text-slate-400 rounded-md w-8 font-medium text-[0.72rem] text-center uppercase tracking-wider',
            week: 'flex w-full mt-1 justify-between',
            day: 'h-8 w-8 text-center text-xs p-0 relative focus-within:relative focus-within:z-20',
            day_button: cn(
              'h-8 w-8 p-0 font-normal hover:bg-cyan-50 hover:text-cyan-700 rounded-lg transition-colors cursor-pointer text-slate-700 flex items-center justify-center'
            ),
            selected:
              '!bg-cyan-600 !text-white hover:!bg-cyan-700 hover:!text-white focus:!bg-cyan-600 focus:!text-white font-semibold rounded-lg shadow-sm',
            today:
              'font-bold text-cyan-600 border border-cyan-200 bg-cyan-50/60 rounded-lg',
            outside: 'text-slate-300 opacity-40',
            disabled:
              'text-slate-300 opacity-30 cursor-not-allowed pointer-events-none',
            hidden: 'invisible',
            ...classNames,
          }}
        />
      )}
    </div>
  );
}

Calendar.displayName = 'Calendar';
