'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2.5 bg-white rounded-xl', className)}
      classNames={{
        root: cn(defaultClassNames.root, 'select-none'),
        months: 'flex flex-col sm:flex-row gap-4 relative',
        month: 'flex flex-col gap-3',
        month_caption: 'flex justify-center pt-1 relative items-center h-8 w-full',
        caption_label: 'text-sm font-semibold text-slate-800 tracking-tight',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute left-1 h-7 w-7 bg-white p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 z-10 rounded-lg border border-slate-200 shadow-2xs cursor-pointer'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute right-1 h-7 w-7 bg-white p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 z-10 rounded-lg border border-slate-200 shadow-2xs cursor-pointer'
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex justify-between w-full mb-1',
        weekday: 'text-slate-400 rounded-md w-8 font-medium text-[0.75rem] text-center uppercase tracking-wider',
        week: 'flex w-full mt-1 justify-between',
        day: 'h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer text-slate-700'
        ),
        selected: '!bg-blue-600 !text-white hover:!bg-blue-700 hover:!text-white focus:!bg-blue-600 focus:!text-white font-semibold rounded-lg shadow-sm',
        today: 'font-bold text-blue-600 border border-blue-200 bg-blue-50/60 rounded-lg',
        outside: 'text-slate-300 opacity-40',
        disabled: 'text-slate-300 opacity-30 cursor-not-allowed pointer-events-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
