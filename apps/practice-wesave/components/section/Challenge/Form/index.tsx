import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { FormikHandlers, FormikHelpers, useFormik } from 'formik';
import 'date-fns';
import cn from 'classnames/bind';
import * as yup from 'yup';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { PrimaryBtn, Badge, TabSelector, DaySelector, Input } from '@/components/atom';
import badgeStyles from '@/styles/Badge.module.scss';
import styles from '@/styles/ChallengeCreateForm.module.scss';
import { BadgeType } from '@/common';

import { badges, days, InitialValuesType } from './constants';
import { addYears, format } from 'date-fns';

const BadgeModal = dynamic(() => import('@/components/section/Modal/BadgeModal'), { ssr: false });

const badgeCx = cn.bind(badgeStyles);
const cx = cn.bind(styles);
const registerSchema = yup.object().shape({
  name: yup.string().max(20).required('챌린지 이름을 작성해 주세요.'),
  goal: yup.string().max(20).required('목표를 설정해 주세요.'),
  actionDay: yup.array().min(1, '최소 1개이상 선택하야 합니다.'),
  badge: yup.string().required('뱃지를 선택해 주세요'),
});

interface ChallengeCreateFormProps {
  isLoading: boolean;
  isError: boolean;
  callback: Function;
}

export default function ChallengeCreateForm({ isLoading, isError, callback }: ChallengeCreateFormProps) {
  const formik = useFormik<InitialValuesType>({
    initialValues: {
      name: '',
      type: 'save',
      actionDay: [],
      endDate: '',
      goal: '',
      startDate: '',
      badge: 'pig',
    },
    onSubmit: (challenge: InitialValuesType, { resetForm }) => {
      callback(challenge);
      resetForm();
    },

    validationSchema: registerSchema,
  });

  useEffect(() => {
    if (isError) {
      toast.error('챌린지 생성에 실패하였습니다.');
    }
  }, [isError]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className={cx('form')}>
        <NameInput handleChange={formik.handleChange} />
        <ChallengeTypeSelector
          type={formik.values.type}
          handleChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
        />
        <DateSelector actionDay={formik.values.actionDay} setFieldValue={formik.setFieldValue} />
        <BadgeSelector
          badge={formik.values.badge}
          handleChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
        />
        <div className={cx('confirm-btn-container')}>
          <PrimaryBtn
            type="submit"
            disabled={Object.keys(formik.errors).length > 0 || isLoading || !formik.dirty}
            className={cx('confirm-btn')}
          >
            {!isError ? '만들기' : '재시도'}
          </PrimaryBtn>
        </div>
      </form>
    </>
  );
}

interface NameInputProps {
  handleChange: FormikHandlers['handleChange'];
}

function NameInput({ handleChange }: NameInputProps) {
  return (
    <div>
      <label className={cx('label')} htmlFor="name">
        챌린지 이름
      </label>
      <Input
        maxLength={20}
        id="name"
        name="name"
        placeholder="야식 줄이고 돈 모으기"
        onChange={handleChange}
        required
        autoFocus
      />
    </div>
  );
}

interface ChallengeTypeSelectorProps {
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
  type: string;
  handleChange: FormikHandlers['handleChange'];
}

function ChallengeTypeSelector({ setFieldValue, type, handleChange }: ChallengeTypeSelectorProps) {
  return (
    <div>
      <div>
        <TabSelector onClick={() => setFieldValue('type', 'save')} isSelected={type === 'save'} className={cx('label')}>
          돈모으기
        </TabSelector>
        <TabSelector
          onClick={() => setFieldValue('type', 'spend')}
          isSelected={type === 'spend'}
          className={cx('label')}
        >
          물건사기
        </TabSelector>
      </div>
      <Input required maxLength={20} name="goal" placeholder="직접 입력" onChange={handleChange} />
    </div>
  );
}

interface DateSelectorProps {
  actionDay: string[];
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
}

function DateSelector({ actionDay, setFieldValue }: DateSelectorProps) {
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

  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => addYears(today, 1), [today]);

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

interface BadgeSelectorProps {
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
  badge: BadgeType | null;
  handleChange: FormikHandlers['handleChange'];
}

function BadgeSelector({ setFieldValue, badge }: BadgeSelectorProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [badgeList, setBadgeList] = useState<BadgeType[]>(badges);

  const onClickBadge = useCallback(
    (selectBadge: BadgeType) => {
      if (selectBadge === badge) {
        return;
      }

      setFieldValue('badge', selectBadge);

      if (isOpenModal) {
        setBadgeList(prevBadges => {
          const updatedBadges = prevBadges.filter(v => v !== selectBadge);
          updatedBadges.unshift(selectBadge);
          return updatedBadges;
        });
      }
    },
    [badge, isOpenModal, setFieldValue],
  );

  return (
    <div>
      <label className={cx('label')}>뱃지 선택</label>
      <div className={cx('badge-container')}>
        {badgeList.slice(0, 3).map(b => (
          <Badge onClick={() => onClickBadge(b)} isSelected={badge === b} type={b} key={b} />
        ))}
        <button onClick={() => setIsOpenModal(true)} className={badgeCx('badge')}>
          더 보기
        </button>
      </div>
      {isOpenModal && (
        <BadgeModal
          isOpen={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}
          oldSelectedBadge={badge}
          onClickSelectBtn={(badge: BadgeType) => onClickBadge(badge)}
        />
      )}
    </div>
  );
}
