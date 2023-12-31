import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames/bind';
import styles from '@/styles/salary.module.scss';
import SalaryForm from '@/components/template/salary/SalaryForm';
import { useRegistIncome, useSalaryInput } from '@/hooks/quries/income/useSalaryInput';
import { Income } from '@/common';

const cx = cn.bind(styles);

export default function Salary() {
  const { mutate } = useRegistIncome();
  const router = useNavigate();
  const { onChangeIncome, onChangePayday, onChangeQuitTime, onChangeStartTime, onChangeWorkday, state } =
    useSalaryInput();

  const onValidateInput = useCallback(() => {
    const isDaySelected = state.workday.length === 0;
    const { income, payday, quitTime, startTime } = state;
    return Object.values({ income, payday, quitTime, startTime }).includes(null) || isDaySelected;
  }, [state]);

  return (
    <div className={cx('salary')}>
      <SalaryForm>
        <SalaryForm.TimeRangeInput
          onChangeQuitTime={onChangeQuitTime}
          onChangeStartTime={onChangeStartTime}
          quitTime={state.quitTime}
          startTime={state.startTime}
        />
        <SalaryForm.DayButtons onChangeWorkday={onChangeWorkday} />
        <SalaryForm.PayDayInput onChangePayday={onChangePayday} payday={state.payday} />
        <SalaryForm.IncomeInput onChangeIncome={onChangeIncome} income={state.income} />
        <SalaryForm.RegisterButton
          disabled={onValidateInput()}
          onClick={() =>
            mutate(state as Income, {
              onSuccess: () => router('/timer'),
            })
          }
        />
      </SalaryForm>
    </div>
  );
}
