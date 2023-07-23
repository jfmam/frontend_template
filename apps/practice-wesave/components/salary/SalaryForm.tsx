import Image from 'next/image';
import { useCallback } from 'react';
import cn from 'classnames/bind';
import { useMediaQuery } from 'react-responsive';
import styles from '@/styles/SalaryForm.module.scss';
import { useRouter } from 'next/router';
import { Income } from '@/common';
import { InitialStateType, useRegistIncome } from '@/hooks/quries/income/useSalaryInput';

import { stringToMoney } from '../utils';
import Input from '../input';
import { PrimaryBtn } from '../button/PrimaryBtn';

import DayButton from './DayButton';

const cx = cn.bind(styles);

interface IncomeProps {
  // onChangePage: () => void;
  onChangeIncome: (income: string) => void;
  onChangeQuitTime: (quitTime: string) => void;
  onChangePayday: (payday: string) => void;
  onChangeStartTime: (startTime: string) => void;
  onChangeWorkday: (workDay: number) => void;
  state: InitialStateType;
}

const days = ['월', '화', '수', '목', '금', '토', '일'];

export default function SalaryForm({
  onChangeIncome,
  onChangePayday,
  onChangeQuitTime,
  onChangeStartTime,
  onChangeWorkday,
  state,
}: IncomeProps) {
  const { mutate } = useRegistIncome();
  const router = useRouter();
  const isDesktop = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const onValidateInput = useCallback(() => {
    const isDaySelected = state.workday.length === 0;
    const { income, payday, quitTime, startTime } = state;
    return Object.values({ income, payday, quitTime, startTime }).includes(null) || isDaySelected;
  }, [state]);

  return (
    <div className={cx('income')}>
      <div>
        매일 (
        <Input
          onChange={e => onChangeStartTime(e.target.value)}
          onBlur={e => {
            e.currentTarget.value = state.startTime?.toString().padStart(2, '0') || '00';
          }}
          className={cx('input', 'input-number')}
          maxLength={2}
          placeholder="00"
          aria-label="startTime"
        />
        )시 부터 (
        <Input
          onChange={e => onChangeQuitTime(e.target.value)}
          onBlur={e => {
            e.currentTarget.value = state.quitTime?.toString().padStart(2, '0') || '24';
          }}
          className={cx('input', 'input-number')}
          maxLength={2}
          placeholder="00"
          aria-label="quitTime"
        />
        )시까지
      </div>
      <div>
        매주 (
        {days.map((day, idx) => (
          <DayButton onClick={() => onChangeWorkday((idx + 1) % 7)} key={day} day={day} />
        ))}
        ) 일해서
      </div>
      <div className={cx('center')}>
        <div style={{ paddingRight: isDesktop ? 57 : 16 }}>
          매달(
          <Input
            onChange={e => onChangePayday(e.target.value)}
            onBlur={e => {
              e.currentTarget.value = state.payday?.toString() || '1';
            }}
            className={cx('input', 'input-number')}
            maxLength={2}
            placeholder="00"
            aria-label="payday"
          />
          )일에
        </div>
        <span className={cx('arrow-logo')}>
          <Image fill sizes="(max-width: 425px) 59px, 18.93px" src="/arrow.svg" alt="" loading="lazy" />
        </span>
      </div>
      <div className={cx('center')}>
        <span className={cx('won-logo')}>
          <Image fill sizes="(max-width: 425px) 42px, 24.71px" src="/won.svg" alt="" loading="lazy" />
        </span>
        <>(</>
        <Input
          onBlur={e => {
            e.currentTarget.value = stringToMoney(state.income?.toString() || '0');
          }}
          className={cx('input', 'input-salary')}
          onChange={e => onChangeIncome(e.target.value)}
          maxLength={10}
          placeholder="00,000,000"
          aria-label="income"
        />
        <>)원 벌어요</>
      </div>
      <div className={cx('button-container')}>
        <PrimaryBtn
          disabled={onValidateInput()}
          onClick={() =>
            mutate(state as Income, {
              onSuccess: () => router.push('/timer'),
            })
          }
        >
          Done
        </PrimaryBtn>
      </div>
    </div>
  );
}
