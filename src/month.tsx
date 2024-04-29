import React from "react";
import { clsx } from "clsx";
import Week from "./week";
import * as utils from "./date_utils";
import type {
  LocaleObj,
  DayDisabledOptions,
  DateNumberType,
  HolidaysMap,
} from "./date_utils";

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

const MONTH_COLUMNS_LAYOUT = {
  TWO_COLUMNS: "two_columns",
  THREE_COLUMNS: "three_columns",
  FOUR_COLUMNS: "four_columns",
};
const MONTH_COLUMNS = {
  [MONTH_COLUMNS_LAYOUT.TWO_COLUMNS]: {
    grid: [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
      [10, 11],
    ],
    verticalNavigationOffset: 2,
  },
  [MONTH_COLUMNS_LAYOUT.THREE_COLUMNS]: {
    grid: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
    ],
    verticalNavigationOffset: 3,
  },
  [MONTH_COLUMNS_LAYOUT.FOUR_COLUMNS]: {
    grid: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
    ],
    verticalNavigationOffset: 4,
  },
};
const MONTH_NAVIGATION_HORIZONTAL_OFFSET = 1;

function getMonthColumnsLayout(
  showFourColumnMonthYearPicker?: boolean,
  showTwoColumnMonthYearPicker?: boolean,
) {
  if (showFourColumnMonthYearPicker) {
    return MONTH_COLUMNS_LAYOUT.FOUR_COLUMNS;
  }
  if (showTwoColumnMonthYearPicker) {
    return MONTH_COLUMNS_LAYOUT.TWO_COLUMNS;
  }
  return MONTH_COLUMNS_LAYOUT.THREE_COLUMNS;
}

interface MonthProps {
  dayClassName?: (date: Date) => string;
  monthClassName?: (date: Date) => string;
  filterDate?: (date: Date) => boolean;
  formatWeekNumber?: (date: Date) => number;
  onDayClick?: (
    date: Date,
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    orderInDisplay?: number,
  ) => void;
  onDayMouseEnter?: (date: Date) => void;
  onMouseLeave?: () => void;
  onWeekSelect?: (date: Date) => void;
  setPreSelection?: (date?: Date) => void;
  setOpen?: (open: boolean) => void;
  renderDayContents?: (day: number, date: Date) => React.ReactNode;
  renderMonthContent?: (
    m: number,
    shortMonthText: string,
    fullMonthText: string,
    day: Date,
  ) => React.ReactNode;
  renderQuarterContent?: (q: number, shortQuarter: string) => React.ReactNode;
  handleOnKeyDown?: (event: React.KeyboardEvent) => void;
  handleOnMonthKeyDown?: (event: React.KeyboardEvent) => void;
  ariaLabelPrefix?: string;
  chooseDayAriaLabelPrefix?: string;
  disabledDayAriaLabelPrefix?: string;
  disabledKeyboardNavigation?: boolean;
  day: Date;
  endDate?: Date;
  orderInDisplay?: number;
  excludeDates?: DayDisabledOptions["excludeDates"];
  excludeDateIntervals?: DayDisabledOptions["excludeDateIntervals"];
  fixedHeight?: boolean;
  highlightDates?: Map<string, Date>;
  holidays?: HolidaysMap;
  includeDates?: DayDisabledOptions["includeDates"];
  includeDateIntervals?: DayDisabledOptions["includeDateIntervals"];
  inline?: boolean;
  shouldFocusDayInline?: boolean;
  locale?: string | LocaleObj;
  maxDate?: Date;
  minDate?: Date;
  usePointerEvent?: boolean;
  peekNextMonth?: boolean;
  preSelection?: Date;
  selected?: Date;
  selectingDate?: Date;
  calendarStartDay?: DateNumberType;
  selectsEnd?: boolean;
  selectsStart?: boolean;
  selectsRange?: boolean;
  selectsDisabledDaysInRange?: boolean;
  selectsMultiple?: boolean;
  selectedDates?: Date[];
  showWeekNumbers?: boolean;
  startDate?: Date;
  shouldCloseOnSelect?: boolean;
  showMonthYearPicker?: boolean;
  showFullMonthYearPicker?: boolean;
  showTwoColumnMonthYearPicker?: boolean;
  showFourColumnMonthYearPicker?: boolean;
  showQuarterYearPicker?: boolean;
  showWeekPicker?: boolean;
  isInputFocused?: boolean;
  weekAriaLabelPrefix?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  monthShowsDuplicateDaysEnd?: boolean;
  monthShowsDuplicateDaysStart?: boolean;
}

/**
 * `Month` is a React component that represents a month in a calendar.
 * It accepts a `MonthProps` object as props which provides various configurations and event handlers.
 *
 * @prop dayClassName - Function to determine the class name for a day.
 * @prop monthClassName - Function to determine the class name for a month.
 * @prop filterDate - Function to filter dates.
 * @prop formatWeekNumber - Function to format the week number.
 * @prop onDayClick - Function to handle day click events.
 * @prop onDayMouseEnter - Function to handle mouse enter events on a day.
 * @prop onMouseLeave - Function to handle mouse leave events.
 * @prop onWeekSelect - Function to handle week selection.
 * @prop setPreSelection - Function to set pre-selection.
 * @prop setOpen - Function to set open state.
 * @prop renderDayContents - Function to render day contents.
 * @prop renderMonthContent - Function to render month content.
 * @prop renderQuarterContent - Function to render quarter content.
 * @prop handleOnKeyDown - Function to handle key down events.
 * @prop handleOnMonthKeyDown - Function to handle key down events on a month.
 * @prop ariaLabelPrefix - Aria label prefix.
 * @prop chooseDayAriaLabelPrefix - Aria label prefix for choosing a day.
 * @prop disabledDayAriaLabelPrefix - Aria label prefix for disabled day.
 * @prop disabledKeyboardNavigation - Flag to disable keyboard navigation.
 * @prop day - The day.
 * @prop endDate - The end date.
 * @prop orderInDisplay - The order in display.
 * @prop excludeDates - Dates to exclude.
 * @prop excludeDateIntervals - Date intervals to exclude.
 * @prop fixedHeight - Flag to set fixed height.
 * @prop highlightDates - Dates to highlight.
 * @prop holidays - Holidays.
 * @prop includeDates - Dates to include.
 * @prop includeDateIntervals - Date intervals to include.
 * @prop inline - Flag to set inline.
 * @prop shouldFocusDayInline - Flag to set focus on day inline.
 * @prop locale - The locale.
 * @prop maxDate - The maximum date.
 * @prop minDate - The minimum date.
 * @prop usePointerEvent - Flag to use pointer event.
 * @prop peekNextMonth - Flag to peek next month.
 * @prop preSelection - The pre-selection.
 * @prop selected - The selected date.
 * @prop selectingDate - The selecting date.
 * @prop calendarStartDay - The calendar start day.
 * @prop selectsEnd - Flag to select end.
 * @prop selectsStart - Flag to select start.
 * @prop selectsRange - Flag to select range.
 * @prop selectsDisabledDaysInRange - Flag to select disabled days in range.
 * @prop selectsMultiple - Flag to select multiple.
 * @prop selectedDates - The selected dates.
 * @prop showWeekNumbers - Flag to show week numbers.
 * @prop startDate - The start date.
 * @prop shouldCloseOnSelect - Flag to close on select.
 * @prop showMonthYearPicker - Flag to show month year picker.
 * @prop showFullMonthYearPicker - Flag to show full month year picker.
 * @prop showTwoColumnMonthYearPicker - Flag to show two column month year picker.
 * @prop showFourColumnMonthYearPicker - Flag to show four column month year picker.
 * @prop showQuarterYearPicker - Flag to show quarter year picker.
 * @prop showWeekPicker - Flag to show week picker.
 * @prop isInputFocused - Flag to set input focus.
 * @prop weekAriaLabelPrefix - Aria label prefix for week.
 * @prop containerRef - The container reference.
 * @prop monthShowsDuplicateDaysEnd - Flag to show duplicate days at the end of the month.
 * @prop monthShowsDuplicateDaysStart - Flag to show duplicate days at the start of the month.
 *
 * @example
 * ```tsx
 * function App() {
 *  const handleDayClick = (date) => {
 *     console.log('Day clicked: ', date);
 *   };
 *
 *   const handleDayMouseEnter = (date) => {
 *     console.log('Mouse entered on day: ', date);
 *   };
 *
 *   return (
 *     <div>
 *       <Month
 *         day={new Date()}
 *         endDate={new Date()}
 *         onDayClick={handleDayClick}
 *         onDayMouseEnter={handleDayMouseEnter}
 *         disabledKeyboardNavigation={false}
 *         showWeekNumbers={true}
 *         showMonthYearPicker={false}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export default class Month extends React.Component<MonthProps> {
  MONTH_REFS = [...Array(12)].map(() => React.createRef<HTMLDivElement>());
  QUARTER_REFS = [...Array(4)].map(() => React.createRef<HTMLDivElement>());

  isDisabled = (day: Date) =>
    // Almost all props previously were passed as this.props w/o proper typing with prop-types
    // after the migration to TS i made it explicit
    utils.isDayDisabled(day, {
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      excludeDates: this.props.excludeDates,
      excludeDateIntervals: this.props.excludeDateIntervals,
      includeDateIntervals: this.props.includeDateIntervals,
      includeDates: this.props.includeDates,
      filterDate: this.props.filterDate,
    });

  isExcluded = (day: Date) =>
    // Almost all props previously were passed as this.props w/o proper typing with prop-types
    // after the migration to TS i made it explicit
    utils.isDayExcluded(day, {
      excludeDates: this.props.excludeDates,
      excludeDateIntervals: this.props.excludeDateIntervals,
    });

  handleDayClick = (
    day: Date,
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    this.props.onDayClick?.(day, event, this.props.orderInDisplay);
  };

  handleDayMouseEnter = (day: Date) => {
    this.props.onDayMouseEnter?.(day);
  };

  handleMouseLeave = () => {
    this.props.onMouseLeave?.();
  };

  isRangeStartMonth = (m: number) => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameMonth(utils.setMonth(day, m), startDate);
  };

  isRangeStartQuarter = (q: number) => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameQuarter(utils.setQuarter(day, q), startDate);
  };

  isRangeEndMonth = (m: number) => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameMonth(utils.setMonth(day, m), endDate);
  };

  isRangeEndQuarter = (q: number) => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return utils.isSameQuarter(utils.setQuarter(day, q), endDate);
  };

  isInSelectingRangeMonth = (m: number) => {
    const { day, selectsStart, selectsEnd, selectsRange, startDate, endDate } =
      this.props;

    const selectingDate = this.props.selectingDate ?? this.props.preSelection;

    if (!(selectsStart || selectsEnd || selectsRange) || !selectingDate) {
      return false;
    }

    if (selectsStart && endDate) {
      return utils.isMonthInRange(selectingDate, endDate, m, day);
    }

    if (selectsEnd && startDate) {
      return utils.isMonthInRange(startDate, selectingDate, m, day);
    }

    if (selectsRange && startDate && !endDate) {
      return utils.isMonthInRange(startDate, selectingDate, m, day);
    }

    return false;
  };

  isSelectingMonthRangeStart = (m: number) => {
    if (!this.isInSelectingRangeMonth(m)) {
      return false;
    }

    const { day, startDate, selectsStart } = this.props;
    const _month = utils.setMonth(day, m);
    const selectingDate = this.props.selectingDate ?? this.props.preSelection;

    if (selectsStart) {
      return utils.isSameMonth(_month, selectingDate);
    } else {
      return utils.isSameMonth(_month, startDate);
    }
  };

  isSelectingMonthRangeEnd = (m: number) => {
    if (!this.isInSelectingRangeMonth(m)) {
      return false;
    }

    const { day, endDate, selectsEnd, selectsRange } = this.props;
    const _month = utils.setMonth(day, m);
    const selectingDate = this.props.selectingDate ?? this.props.preSelection;

    if (selectsEnd || selectsRange) {
      return utils.isSameMonth(_month, selectingDate);
    } else {
      return utils.isSameMonth(_month, endDate);
    }
  };

  isInSelectingRangeQuarter = (q: number) => {
    const { day, selectsStart, selectsEnd, selectsRange, startDate, endDate } =
      this.props;

    const selectingDate = this.props.selectingDate ?? this.props.preSelection;

    if (!(selectsStart || selectsEnd || selectsRange) || !selectingDate) {
      return false;
    }

    if (selectsStart && endDate) {
      return utils.isQuarterInRange(selectingDate, endDate, q, day);
    }

    if (selectsEnd && startDate) {
      return utils.isQuarterInRange(startDate, selectingDate, q, day);
    }

    if (selectsRange && startDate && !endDate) {
      return utils.isQuarterInRange(startDate, selectingDate, q, day);
    }

    return false;
  };

  isWeekInMonth = (startOfWeek: Date) => {
    const day = this.props.day;
    const endOfWeek = utils.addDays(startOfWeek, 6);
    return (
      utils.isSameMonth(startOfWeek, day) || utils.isSameMonth(endOfWeek, day)
    );
  };

  isCurrentMonth = (day: Date, m: number) =>
    utils.getYear(day) === utils.getYear(utils.newDate()) &&
    m === utils.getMonth(utils.newDate());

  isCurrentQuarter = (day: Date, q: number) =>
    utils.getYear(day) === utils.getYear(utils.newDate()) &&
    q === utils.getQuarter(utils.newDate());

  isSelectedMonth = (day: Date, m: number, selected: Date) =>
    utils.getMonth(selected) === m &&
    utils.getYear(day) === utils.getYear(selected);

  isSelectedQuarter = (day: Date, q: number, selected: Date) =>
    utils.getQuarter(day) === q &&
    utils.getYear(day) === utils.getYear(selected);

  renderWeeks = () => {
    const weeks = [];
    let isFixedHeight = this.props.fixedHeight;

    let i = 0;
    let breakAfterNextPush = false;
    let currentWeekStart = utils.getStartOfWeek(
      utils.getStartOfMonth(this.props.day),
      this.props.locale,
      this.props.calendarStartDay,
    );

    const isPreSelected = (preSelection: Date) =>
      this.props.showWeekPicker
        ? utils.getStartOfWeek(
            preSelection,
            this.props.locale,
            this.props.calendarStartDay,
          )
        : this.props.preSelection;

    const isSelected = (selected: Date) =>
      this.props.showWeekPicker
        ? utils.getStartOfWeek(
            selected,
            this.props.locale,
            this.props.calendarStartDay,
          )
        : this.props.selected;

    const selected = this.props.selected
      ? isSelected(this.props.selected)
      : undefined;

    const preSelection = this.props.preSelection
      ? isPreSelected(this.props.preSelection)
      : undefined;

    while (true) {
      weeks.push(
        <Week
          ariaLabelPrefix={this.props.weekAriaLabelPrefix}
          chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
          disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
          key={i}
          day={currentWeekStart}
          month={utils.getMonth(this.props.day)}
          onDayClick={this.handleDayClick}
          usePointerEvent={this.props.usePointerEvent}
          onDayMouseEnter={this.handleDayMouseEnter}
          onWeekSelect={this.props.onWeekSelect}
          formatWeekNumber={this.props.formatWeekNumber}
          locale={this.props.locale}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          excludeDates={this.props.excludeDates}
          excludeDateIntervals={this.props.excludeDateIntervals}
          includeDates={this.props.includeDates}
          includeDateIntervals={this.props.includeDateIntervals}
          inline={this.props.inline}
          shouldFocusDayInline={this.props.shouldFocusDayInline}
          highlightDates={this.props.highlightDates}
          holidays={this.props.holidays}
          selectingDate={this.props.selectingDate}
          filterDate={this.props.filterDate}
          preSelection={preSelection}
          selected={selected}
          selectsStart={this.props.selectsStart}
          selectsEnd={this.props.selectsEnd}
          selectsRange={this.props.selectsRange}
          selectsDisabledDaysInRange={this.props.selectsDisabledDaysInRange}
          selectsMultiple={this.props.selectsMultiple}
          selectedDates={this.props.selectedDates}
          showWeekNumber={this.props.showWeekNumbers}
          showWeekPicker={this.props.showWeekPicker}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          dayClassName={this.props.dayClassName}
          setOpen={this.props.setOpen}
          shouldCloseOnSelect={this.props.shouldCloseOnSelect}
          disabledKeyboardNavigation={this.props.disabledKeyboardNavigation}
          renderDayContents={this.props.renderDayContents}
          handleOnKeyDown={this.props.handleOnKeyDown}
          isInputFocused={this.props.isInputFocused}
          containerRef={this.props.containerRef}
          calendarStartDay={this.props.calendarStartDay}
          monthShowsDuplicateDaysEnd={this.props.monthShowsDuplicateDaysEnd}
          monthShowsDuplicateDaysStart={this.props.monthShowsDuplicateDaysStart}
        />,
      );

      if (breakAfterNextPush) break;

      i++;
      currentWeekStart = utils.addWeeks(currentWeekStart, 1);

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek =
        isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
      const isNonFixedAndOutOfMonth =
        !isFixedHeight && !this.isWeekInMonth(currentWeekStart);

      if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true;
        } else {
          break;
        }
      }
    }

    return weeks;
  };

  onMonthClick = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
    m: number,
  ) => {
    const { isDisabled, labelDate } = this.isMonthDisabledForLabelDate(m);

    if (isDisabled) {
      return;
    }

    this.handleDayClick(utils.getStartOfMonth(labelDate), e);
  };

  onMonthMouseEnter = (m: number) => {
    const { isDisabled, labelDate } = this.isMonthDisabledForLabelDate(m);

    if (isDisabled) {
      return;
    }

    this.handleDayMouseEnter(utils.getStartOfMonth(labelDate));
  };

  handleMonthNavigation = (newMonth: number, newDate: Date) => {
    if (this.isDisabled(newDate) || this.isExcluded(newDate)) {
      return;
    }

    this.props.setPreSelection?.(newDate);

    this.MONTH_REFS[newMonth]?.current?.focus();
  };

  onMonthKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    month: number,
  ) => {
    const {
      selected,
      preSelection,
      disabledKeyboardNavigation,
      showTwoColumnMonthYearPicker,
      showFourColumnMonthYearPicker,
      setPreSelection,
      handleOnMonthKeyDown,
    } = this.props;
    const eventKey = event.key;
    if (eventKey !== "Tab") {
      // preventDefault on tab event blocks focus change
      event.preventDefault();
    }
    if (!disabledKeyboardNavigation) {
      const monthColumnsLayout = getMonthColumnsLayout(
        showFourColumnMonthYearPicker,
        showTwoColumnMonthYearPicker,
      );

      const verticalOffset =
        MONTH_COLUMNS[monthColumnsLayout]?.verticalNavigationOffset;

      const monthsGrid = MONTH_COLUMNS[monthColumnsLayout]?.grid;

      switch (eventKey) {
        case "Enter":
          if (!this.isMonthDisabled(month)) {
            this.onMonthClick(event, month);
            setPreSelection?.(selected);
          }
          break;
        case "ArrowRight":
          if (!preSelection) {
            break;
          }
          this.handleMonthNavigation(
            month === 11 ? 0 : month + MONTH_NAVIGATION_HORIZONTAL_OFFSET,
            utils.addMonths(preSelection, MONTH_NAVIGATION_HORIZONTAL_OFFSET),
          );
          break;
        case "ArrowLeft":
          if (!preSelection) {
            break;
          }
          this.handleMonthNavigation(
            month === 0 ? 11 : month - MONTH_NAVIGATION_HORIZONTAL_OFFSET,
            utils.subMonths(preSelection, MONTH_NAVIGATION_HORIZONTAL_OFFSET),
          );
          break;
        case "ArrowUp":
          if (!preSelection) {
            break;
          }
          this.handleMonthNavigation(
            // Check if month on the first row
            monthsGrid?.[0]?.includes(month)
              ? month + 12 - (verticalOffset ?? 0)
              : month - (verticalOffset ?? 0),
            utils.subMonths(preSelection, verticalOffset ?? 0),
          );
          break;
        case "ArrowDown":
          if (!preSelection) {
            break;
          }
          this.handleMonthNavigation(
            // Check if month on the last row
            monthsGrid?.[monthsGrid.length - 1]?.includes(month)
              ? month - 12 + (verticalOffset ?? 0)
              : month + (verticalOffset ?? 0),
            utils.addMonths(preSelection, verticalOffset ?? 0),
          );
          break;
      }
    }

    handleOnMonthKeyDown && handleOnMonthKeyDown(event);
  };

  private propsToOnDisableClick = (
    prps: MonthProps,
  ): {
    minDate?: Date;
    maxDate?: Date;
    excludeDates?: Date[];
    includeDates?: Date[];
    filterDate?: (date: Date) => boolean;
  } => ({
    minDate: prps.minDate,
    maxDate: prps.maxDate,
    excludeDates: prps.excludeDates?.reduce((acc, itm) => {
      if (itm instanceof Date) {
        acc.push(itm);
      } else if (itm.date) {
        acc.push(itm.date);
      }
      return acc;
    }, [] as Date[]),
    includeDates: prps.includeDates,
    filterDate: prps.filterDate,
  });

  onQuarterClick = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    q: number,
  ) => {
    const labelDate = utils.setQuarter(this.props.day, q);

    if (
      utils.isQuarterDisabled(labelDate, this.propsToOnDisableClick(this.props))
    ) {
      return;
    }

    this.handleDayClick(utils.getStartOfQuarter(labelDate), e);
  };

  onQuarterMouseEnter = (q: number) => {
    const labelDate = utils.setQuarter(this.props.day, q);

    if (
      utils.isQuarterDisabled(labelDate, this.propsToOnDisableClick(this.props))
    ) {
      return;
    }

    this.handleDayMouseEnter(utils.getStartOfQuarter(labelDate));
  };

  handleQuarterNavigation = (newQuarter: number, newDate: Date) => {
    if (this.isDisabled(newDate) || this.isExcluded(newDate)) {
      return;
    }
    this.props.setPreSelection?.(newDate);
    this.QUARTER_REFS[newQuarter - 1]?.current?.focus();
  };

  onQuarterKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    quarter: number,
  ) => {
    const eventKey = event.key;
    if (!this.props.disabledKeyboardNavigation) {
      switch (eventKey) {
        case "Enter":
          this.onQuarterClick(event, quarter);
          this.props.setPreSelection?.(this.props.selected);
          break;
        case "ArrowRight":
          if (!this.props.preSelection) {
            break;
          }
          this.handleQuarterNavigation(
            quarter === 4 ? 1 : quarter + 1,
            utils.addQuarters(this.props.preSelection, 1),
          );
          break;
        case "ArrowLeft":
          if (!this.props.preSelection) {
            break;
          }
          this.handleQuarterNavigation(
            quarter === 1 ? 4 : quarter - 1,
            utils.subQuarters(this.props.preSelection, 1),
          );
          break;
      }
    }
  };

  isMonthDisabledForLabelDate = (
    month: number,
  ): {
    isDisabled: boolean;
    labelDate: Date;
  } => {
    const { day, minDate, maxDate, excludeDates, includeDates } = this.props;
    const labelDate = utils.setMonth(day, month);
    return {
      isDisabled:
        ((minDate || maxDate || excludeDates || includeDates) &&
          utils.isMonthDisabled(
            labelDate,
            this.propsToOnDisableClick(this.props),
          )) ??
        false,
      labelDate,
    };
  };

  isMonthDisabled = (month: number) => {
    const { isDisabled } = this.isMonthDisabledForLabelDate(month);
    return isDisabled;
  };

  getMonthClassNames = (m: number) => {
    const { day, startDate, endDate, selected, preSelection, monthClassName } =
      this.props;
    const _monthClassName = monthClassName
      ? monthClassName(utils.setMonth(day, m))
      : undefined;
    return clsx(
      "react-datepicker__month-text",
      `react-datepicker__month-${m}`,
      _monthClassName,
      {
        "react-datepicker__month-text--disabled": this.isMonthDisabled(m),
        "react-datepicker__month-text--selected": selected
          ? this.isSelectedMonth(day, m, selected)
          : undefined,
        "react-datepicker__month-text--keyboard-selected":
          !this.props.disabledKeyboardNavigation &&
          preSelection &&
          this.isSelectedMonth(day, m, preSelection),
        "react-datepicker__month-text--in-selecting-range":
          this.isInSelectingRangeMonth(m),
        "react-datepicker__month-text--in-range":
          startDate && endDate
            ? utils.isMonthInRange(startDate, endDate, m, day)
            : undefined,
        "react-datepicker__month-text--range-start": this.isRangeStartMonth(m),
        "react-datepicker__month-text--range-end": this.isRangeEndMonth(m),
        "react-datepicker__month-text--selecting-range-start":
          this.isSelectingMonthRangeStart(m),
        "react-datepicker__month-text--selecting-range-end":
          this.isSelectingMonthRangeEnd(m),
        "react-datepicker__month-text--today": this.isCurrentMonth(day, m),
      },
    );
  };

  getTabIndex = (m: number) => {
    if (this.props.preSelection == null) {
      return "-1";
    }
    const preSelectedMonth = utils.getMonth(this.props.preSelection);
    const tabIndex =
      !this.props.disabledKeyboardNavigation && m === preSelectedMonth
        ? "0"
        : "-1";

    return tabIndex;
  };

  getQuarterTabIndex = (q: number) => {
    if (this.props.preSelection == null) {
      return "-1";
    }
    const preSelectedQuarter = utils.getQuarter(this.props.preSelection);
    const tabIndex =
      !this.props.disabledKeyboardNavigation && q === preSelectedQuarter
        ? "0"
        : "-1";

    return tabIndex;
  };

  getAriaLabel = (month: number) => {
    const {
      chooseDayAriaLabelPrefix = "Choose",
      disabledDayAriaLabelPrefix = "Not available",
      day,
      locale,
    } = this.props;
    const labelDate = utils.setMonth(day, month);
    const prefix =
      this.isDisabled(labelDate) || this.isExcluded(labelDate)
        ? disabledDayAriaLabelPrefix
        : chooseDayAriaLabelPrefix;

    return `${prefix} ${utils.formatDate(labelDate, "MMMM yyyy", locale)}`;
  };

  getQuarterClassNames = (q: number) => {
    const {
      day,
      startDate,
      endDate,
      selected,
      minDate,
      maxDate,
      preSelection,
      disabledKeyboardNavigation,
    } = this.props;
    return clsx(
      "react-datepicker__quarter-text",
      `react-datepicker__quarter-${q}`,
      {
        "react-datepicker__quarter-text--disabled":
          (minDate || maxDate) &&
          utils.isQuarterDisabled(
            utils.setQuarter(day, q),
            this.propsToOnDisableClick(this.props),
          ),
        "react-datepicker__quarter-text--selected": selected
          ? this.isSelectedQuarter(day, q, selected)
          : undefined,
        "react-datepicker__quarter-text--keyboard-selected":
          !disabledKeyboardNavigation &&
          preSelection &&
          this.isSelectedQuarter(day, q, preSelection),
        "react-datepicker__quarter-text--in-selecting-range":
          this.isInSelectingRangeQuarter(q),
        "react-datepicker__quarter-text--in-range":
          startDate && endDate
            ? utils.isQuarterInRange(startDate, endDate, q, day)
            : undefined,
        "react-datepicker__quarter-text--range-start":
          this.isRangeStartQuarter(q),
        "react-datepicker__quarter-text--range-end": this.isRangeEndQuarter(q),
      },
    );
  };

  getMonthContent = (m: number) => {
    const { showFullMonthYearPicker, renderMonthContent, locale, day } =
      this.props;
    const shortMonthText = utils.getMonthShortInLocale(m, locale);
    const fullMonthText = utils.getMonthInLocale(m, locale);
    if (renderMonthContent) {
      return renderMonthContent(m, shortMonthText, fullMonthText, day);
    }
    return showFullMonthYearPicker ? fullMonthText : shortMonthText;
  };

  getQuarterContent = (q: number) => {
    const { renderQuarterContent, locale } = this.props;
    const shortQuarter = utils.getQuarterShortInLocale(q, locale);
    return renderQuarterContent?.(q, shortQuarter) ?? shortQuarter;
  };

  renderMonths = () => {
    const {
      showTwoColumnMonthYearPicker,
      showFourColumnMonthYearPicker,
      day,
      selected,
    } = this.props;

    const monthColumns =
      MONTH_COLUMNS[
        getMonthColumnsLayout(
          showFourColumnMonthYearPicker,
          showTwoColumnMonthYearPicker,
        )
      ]?.grid;
    return monthColumns?.map((month, i) => (
      <div className="react-datepicker__month-wrapper" key={i}>
        {month.map((m, j) => (
          <div
            ref={this.MONTH_REFS[m]}
            key={j}
            onClick={(ev) => {
              this.onMonthClick(ev, m);
            }}
            onKeyDown={(ev) => {
              if (utils.isSpaceKeyDown(ev)) {
                ev.preventDefault();
                ev.key = "Enter";
              }

              this.onMonthKeyDown(ev, m);
            }}
            onMouseEnter={
              !this.props.usePointerEvent
                ? () => this.onMonthMouseEnter(m)
                : undefined
            }
            onPointerEnter={
              this.props.usePointerEvent
                ? () => this.onMonthMouseEnter(m)
                : undefined
            }
            tabIndex={Number(this.getTabIndex(m))}
            className={this.getMonthClassNames(m)}
            aria-disabled={this.isMonthDisabled(m)}
            role="option"
            aria-label={this.getAriaLabel(m)}
            aria-current={this.isCurrentMonth(day, m) ? "date" : undefined}
            aria-selected={selected && this.isSelectedMonth(day, m, selected)}
          >
            {this.getMonthContent(m)}
          </div>
        ))}
      </div>
    ));
  };

  renderQuarters = () => {
    const { day, selected } = this.props;
    const quarters = [1, 2, 3, 4];
    return (
      <div className="react-datepicker__quarter-wrapper">
        {quarters.map((q, j) => (
          <div
            key={j}
            ref={this.QUARTER_REFS[j]}
            role="option"
            onClick={(ev) => {
              this.onQuarterClick(ev, q);
            }}
            onKeyDown={(ev) => {
              this.onQuarterKeyDown(ev, q);
            }}
            onMouseEnter={
              !this.props.usePointerEvent
                ? () => this.onQuarterMouseEnter(q)
                : undefined
            }
            onPointerEnter={
              this.props.usePointerEvent
                ? () => this.onQuarterMouseEnter(q)
                : undefined
            }
            className={this.getQuarterClassNames(q)}
            aria-selected={selected && this.isSelectedQuarter(day, q, selected)}
            tabIndex={Number(this.getQuarterTabIndex(q))}
            aria-current={this.isCurrentQuarter(day, q) ? "date" : undefined}
          >
            {this.getQuarterContent(q)}
          </div>
        ))}
      </div>
    );
  };

  getClassNames = () => {
    const {
      selectingDate,
      selectsStart,
      selectsEnd,
      showMonthYearPicker,
      showQuarterYearPicker,
      showWeekPicker,
    } = this.props;

    return clsx(
      "react-datepicker__month",
      {
        "react-datepicker__month--selecting-range":
          selectingDate && (selectsStart || selectsEnd),
      },
      { "react-datepicker__monthPicker": showMonthYearPicker },
      { "react-datepicker__quarterPicker": showQuarterYearPicker },
      { "react-datepicker__weekPicker": showWeekPicker },
    );
  };

  render() {
    const {
      showMonthYearPicker,
      showQuarterYearPicker,
      day,
      ariaLabelPrefix = "Month ",
    } = this.props;

    const formattedAriaLabelPrefix = ariaLabelPrefix
      ? ariaLabelPrefix.trim() + " "
      : "";

    return (
      <div
        className={this.getClassNames()}
        onMouseLeave={
          !this.props.usePointerEvent ? this.handleMouseLeave : undefined
        }
        onPointerLeave={
          this.props.usePointerEvent ? this.handleMouseLeave : undefined
        }
        aria-label={`${formattedAriaLabelPrefix}${utils.formatDate(day, "MMMM, yyyy", this.props.locale)}`}
        role="listbox"
      >
        {showMonthYearPicker
          ? this.renderMonths()
          : showQuarterYearPicker
            ? this.renderQuarters()
            : this.renderWeeks()}
      </div>
    );
  }
}
