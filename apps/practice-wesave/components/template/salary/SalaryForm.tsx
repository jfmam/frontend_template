import Image from 'next/image';
import { ReactNode } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/SalaryForm.module.scss';

import { stringToMoney } from '../../utils';
import { PrimaryBtn, Input, DayButton } from '../../atom';

const cx = cn.bind(styles);

const days = ['월', '화', '수', '목', '금', '토', '일'];
interface SalaryFormProps {
  children: ReactNode;
}

function SalaryForm({ children }: SalaryFormProps) {
  return <div className={cx('income')}>{children}</div>;
}

interface TimeRangeInputProps {
  onChangeStartTime: (startTime: string) => void;
  startTime: number | null;
  onChangeQuitTime: (quitTime: string) => void;
  quitTime: number | null;
}

function TimeRangeInput({ onChangeStartTime, startTime, onChangeQuitTime, quitTime }: TimeRangeInputProps) {
  return (
    <div>
      매일 (
      <Input
        onChange={e => onChangeStartTime(e.target.value)}
        onBlur={e => {
          e.currentTarget.value = startTime?.toString().padStart(2, '0') || '00';
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
          e.currentTarget.value = quitTime?.toString().padStart(2, '0') || '24';
        }}
        className={cx('input', 'input-number')}
        maxLength={2}
        placeholder="00"
        aria-label="quitTime"
      />
      )시까지
    </div>
  );
}

interface DayButtonsProps {
  onChangeWorkday: (workDay: number) => void;
}

function DayButtons({ onChangeWorkday }: DayButtonsProps) {
  return (
    <div>
      매주 (
      {days.map((day, idx) => (
        <DayButton onClick={() => onChangeWorkday((idx + 1) % 7)} key={day} day={day} />
      ))}
      ) 일해서
    </div>
  );
}

interface PayDayInputProps {
  onChangePayday: (payday: string) => void;
  payday: number | null;
}

function PayDayInput({ onChangePayday, payday }: PayDayInputProps) {
  return (
    <div className={cx('center')}>
      <div className={cx('payday-container')}>
        매달(
        <Input
          onChange={e => onChangePayday(e.target.value)}
          onBlur={e => {
            e.currentTarget.value = payday?.toString() || '1';
          }}
          className={cx('input', 'input-number')}
          maxLength={2}
          placeholder="00"
          aria-label="payday"
        />
        )일에
      </div>
      <span className={cx('arrow-logo')}>
        <Image fill sizes="(max-width: 425px) 59px, 18.93px" src="/arrow.svg" alt="" loading="eager" />
      </span>
    </div>
  );
}

interface IncomeInputProps {
  onChangeIncome: (income: string) => void;
  income: number | null;
}

function IncomeInput({ onChangeIncome, income }: IncomeInputProps) {
  return (
    <div className={cx('center')}>
      <span className={cx('won-logo')}>
        <Image fill sizes="(max-width: 425px) 42px, 24.71px" src="/won.svg" alt="" loading="eager" />
      </span>
      <>
        (
        <Input
          onBlur={e => {
            e.currentTarget.value = stringToMoney(income?.toString() || '0');
          }}
          className={cx('input', 'input-salary')}
          onChange={e => onChangeIncome(e.target.value)}
          maxLength={10}
          placeholder="00,000,000"
          aria-label="income"
        />
        )원 벌어요
      </>
    </div>
  );
}

interface RegisterButtonProps {
  onClick: () => void;
  disabled: boolean;
}

function RegisterButton({ disabled, onClick }: RegisterButtonProps) {
  return (
    <div className={cx('button-container')}>
      <PrimaryBtn disabled={disabled} onClick={onClick}>
        Done
      </PrimaryBtn>
    </div>
  );
}

SalaryForm.TimeRangeInput = TimeRangeInput;
SalaryForm.DayButtons = DayButtons;
SalaryForm.PayDayInput = PayDayInput;
SalaryForm.IncomeInput = IncomeInput;
SalaryForm.RegisterButton = RegisterButton;
export default SalaryForm;
