import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { addYears, format } from 'date-fns';
import { FormikHelpers } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import cn from 'classnames/bind';

import styles from '@/styles/ChallengeCreateForm.module.scss';
import { DaySelector, Input } from '@/components/atom';

import { days } from './constants';

const cx = cn.bind(styles);

interface DateSelectorProps {
  actionDay: string[];
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
}

export default function DateSelector({ actionDay, setFieldValue }: DateSelectorProps) {
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);

  const onClickDaySelector = (day: string) => {
    if (actionDay.includes(day)) {
      setFieldValue(
        'actionDay',
        actionDay.filter(d => d !== day),
      );
      return;
    }

    setFieldValue('actionDay', actionDay.concat(day));
  };

  const onChangeDate = (date: RangeKeyDict) => {
    if (!date.selection.startDate) return;
    setFieldValue('startDate', format(date.selection.startDate, 'yy-MM-dd'));
    if (!date.selection.endDate) return;
    setFieldValue('endDate', format(date.selection.endDate, 'yy-MM-dd'));
    setSelectedRange({
      startDate: date.selection.startDate,
      endDate: date.selection.endDate,
      key: 'selection',
    });
  };

  const today = new Date();
  const maxDate = addYears(today, 1);

  return (
    <div>
      <label htmlFor="deadline" className={cx('label')}>
        기간 & 실천요일
      </label>
      <div>
        <Input
          id="deadline"
          name="startDate"
          placeholder="2023.11.15 ~ 2023.11.20"
          required
          onClick={() => setIsCalendarOpen(true)}
          value={`${format(selectedRange.startDate, 'yy.MM.dd')} ~ ${format(selectedRange.endDate, 'yy.MM.dd')}`}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', border: '1px solid black', margin: 10 }} ref={calendarRef}>
            {isCalendarOpen && (
              <>
                <button onClick={() => setIsCalendarOpen(false)}>닫기</button>
                <div>
                  <DateRange
                    minDate={today}
                    maxDate={maxDate}
                    ranges={[selectedRange]}
                    onChange={onChangeDate}
                    showDateDisplay={false}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={cx('days-container')}>
        {days.map(day => (
          <DaySelector
            onClick={() => {
              onClickDaySelector(day);
            }}
            key={day}
            day={day}
          />
        ))}
      </div>
    </div>
  );
}
