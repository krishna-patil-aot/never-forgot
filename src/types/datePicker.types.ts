export type CalendarViewMode = 'days' | 'months' | 'years';

export interface IDatePickerProps {
  value?: string | Date | null;
  onChange?: (dateString: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  clearable?: boolean;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
}

export interface IUseDatePickerProps {
  value?: string | Date | null;
  onChange?: (dateString: string) => void;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
}

export interface IUseDatePickerReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
  handleClear: (e: React.MouseEvent) => void;
  handleToday: () => void;
  isTodayDisabled: boolean;
}

export interface IUseCalendarProps {
  selectedDate?: Date;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  initialViewMode?: CalendarViewMode;
  onSelectDate?: (date: Date | undefined) => void;
}

export interface IUseCalendarReturn {
  viewMode: CalendarViewMode;
  displayMonth: Date;
  yearRangeStart: number;
  yearRangeEnd: number;
  setViewMode: (mode: CalendarViewMode) => void;
  setDisplayMonth: (date: Date) => void;
  goToYear: (year: number) => void;
  goToMonth: (monthIndex: number) => void;
  goToDate: (date: Date) => void;
  prevYearRange: () => void;
  nextYearRange: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
  isYearDisabled: (year: number) => boolean;
  isMonthDisabled: (year: number, monthIndex: number) => boolean;
}
