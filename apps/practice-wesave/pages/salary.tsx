import cn from 'classnames/bind';
import styles from '@/styles/salary.module.scss';
import { SalaryForm } from '@/components/template';
import { useSalaryInput } from '@/hooks/quries/income/useSalaryInput';

const cx = cn.bind(styles);

export default function Salary() {
  const { onChangeIncome, onChangePayday, onChangeQuitTime, onChangeStartTime, onChangeWorkday, state } =
    useSalaryInput();

  return (
    <div className={cx('salary')}>
      <SalaryForm
        state={state}
        onChangeIncome={onChangeIncome}
        onChangeQuitTime={onChangeQuitTime}
        onChangePayday={onChangePayday}
        onChangeStartTime={onChangeStartTime}
        onChangeWorkday={onChangeWorkday}
      />
    </div>
  );
}
