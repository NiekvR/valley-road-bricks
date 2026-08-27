// custom-datepicker.component.ts
import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    OnChanges,
    SimpleChanges, ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DateRange {
    start: Date | string;
    end: Date | string;
}

interface CalendarDay {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isBlocked: boolean;
    isDisabled: boolean;
}

@Component({
    selector: 'app-custom-datepicker',
    templateUrl: './custom-datepicker.component.html',
    styleUrls: ['./custom-datepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDatepickerComponent),
            multi: true,
        },
    ],
})
export class CustomDatepickerComponent implements ControlValueAccessor, OnChanges {
    /** Prefill / two-way binding support */
    @Input()
    set value(val: Date | string | null) {
        // Always normalize to Date | null
        this.writeValue(this.normalize(val));
    }
    get value(): Date | null {
        return this._value;
    }
    private _value: Date | null = null;

    /** Blocked ranges – dates inside these ranges cannot be selected */
    @Input() blockedRanges: DateRange[] = [];

    /** Optional min / max bounds */
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;

    /** Placeholder shown in the input */
    @Input() placeholder = 'Select a date';

    /** Emit selected date */
    @Output() dateChange = new EventEmitter<Date | null>();
    @Output() valueChange = new EventEmitter<string | null>(); // for two-way binding [(value)]

    // Internal state
    disabled = false;
    isOpen = false;

    viewDate: Date = this.getSafeDate(new Date());
    calendarDays: CalendarDay[] = [];
    weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    private onChange: (value: Date | null) => void = () => {};
    private onTouched: () => void = () => {};

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['blockedRanges'] || changes['minDate'] || changes['maxDate']) {
            this.buildCalendar();
        }
    }

    // ─── ControlValueAccessor ───────────────────────────────────────────────
    writeValue(value: Date | string | null): void {
        // Guarantee that _value is always Date | null
        this._value = this.normalize(value);

        if (this._value) {
            this.viewDate = this.getSafeDate(this._value);
        }

        this.buildCalendar();
    }

    registerOnChange(fn: (value: Date | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ─── UI actions ─────────────────────────────────────────────────────────
    toggle(): void {
        if (this.disabled) return;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.buildCalendar();
        }
    }

    close(): void {
        this.isOpen = false;
        this.onTouched();
    }

    prevMonth(): void {
        this.shiftMonth(-1);
    }

    nextMonth(): void {
        this.shiftMonth(1);
    }

    private shiftMonth(offset: number): void {
        // Create a completely new Date object
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth() + offset;

        this.viewDate = new Date(year, month, 1);

        this.buildCalendar();

        // Force Angular to update the view
        this.cdr.detectChanges();
    }

    selectDay(day: CalendarDay): void {
        if (day.isBlocked || day.isDisabled || !day.isCurrentMonth) return;

        this._value = day.date;
        this.onChange(this._value);
        this.dateChange.emit(this._value);
        this.valueChange.emit(this.formatDate(this._value));
        this.close();
    }

    clear(): void {
        this._value = null;
        this.onChange(null);
        this.dateChange.emit(null);
        this.valueChange.emit(null);
        this.close();
    }

    // ─── Calendar building ──────────────────────────────────────────────────
    private buildCalendar(): void {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

        const startDate = new Date(year, month, 1 - startDayOfWeek);

        const days: CalendarDay[] = [];
        const today = this.normalize(new Date());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const normalized = this.normalize(date);

            const isCurrentMonth = date.getMonth() === month;
            const isBlocked = this.isDateBlocked(normalized!);
            const isDisabled = this.isDateOutOfBounds(normalized!);

            days.push({
                date: normalized!,
                day: date.getDate(),
                isCurrentMonth,
                isToday: normalized!.getTime() === today!.getTime(),
                isSelected: !!this._value && normalized!.getTime() === this._value.getTime(),
                isBlocked,
                isDisabled,
            });
        }

        this.calendarDays = days;
    }

    private isDateBlocked(date: Date): boolean {
        const time = date.getTime();
        console.log(this.blockedRanges);
        return this.blockedRanges.some((range) => {
            const start = this.normalize(range.start);
            const end = this.normalize(range.end);

            if (!start || !end) return false;

            return time >= start.getTime() && time <= end.getTime();
        });
    }

    private isDateOutOfBounds(date: Date): boolean {
        const min = this.normalize(this.minDate);
        const max = this.normalize(this.maxDate);

        if (min && date < min) return true;
        if (max && date > max) return true;
        return false;
    }

    private normalize(d: Date | string | null | undefined): Date | null {
        if (d == null) {
            return null;
        }

        // Already a Date?
        if (d instanceof Date) {
            if (isNaN(d.getTime())) {
                return null; // Invalid Date
            }
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }

        // String (or number)
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) {
            return null; // Invalid date string
        }

        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    }

    get displayValue(): string {
        if (!this._value) return '';
        return this._value.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    get monthLabel(): string {
        return this.viewDate.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
        });
    }

    private getSafeDate(d: Date | string | null | undefined): Date {
        const normalized = this.normalize(d);
        return normalized ?? new Date(); // fallback to today
    }

    formatDate(date: Date): string {

        return date
            .toISOString()
            .split('T')[0];
    }
}
