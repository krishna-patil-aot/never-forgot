export type CalendarViewMode = 'days' | 'months' | 'years';

export interface IDatePickerProps {
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

export interface IUseCalendarProps {
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
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
