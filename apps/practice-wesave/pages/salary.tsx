// import router from 'next/router';
import cn from 'classnames/bind';
import styles from '@/styles/salary.module.scss';
// import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/utils';

import { useStage } from '@/components/salary/stage';
// import Additional from '@/components/salary/Additional';
import SalaryForm from '@/components/salary/SalaryForm';
import { useSalaryInput } from '@/hooks/quries/income/useSalaryInput';

const cx = cn.bind(styles);

export default function Salary() {
  const { stage, dispatch } = useStage();
  const {
    // onChangeAdditional,
    onChangeIncome,
    onChangePayday,
    onChangeQuitTime,
    onChangeStartTime,
    onChangeWorkday,
    state,
  } = useSalaryInput();
  // const { setSalary } = useSalaryStorage();

  const onChangePage = () => {
    dispatch({ type: 'Next_Page' });
  };

  // const onSaveValue = () => {
  //   dispatch({ type: 'DONE' });

  //   if (getLocalStorageItem('salary')) {
  //     removeLocalStorageItem('salary');
  //   }

  //   setLocalStorageItem('salary', state);

  //   router.push('/timer');
  // };

  return (
    <div className={cx('salary')}>
      {stage === 1 ? (
        <SalaryForm
          state={state}
          onChangeIncome={onChangeIncome}
          onChangeQuitTime={onChangeQuitTime}
          onChangePayday={onChangePayday}
          onChangeStartTime={onChangeStartTime}
          onChangePage={onChangePage}
          onChangeWorkday={onChangeWorkday}
        />
      ) : (
        <div>Additional</div>
        // <Additional additional={state.additional} onChangeAdditional={onChangeAdditional} onSaveValue={onSaveValue} />
      )}
    </div>
  );
}
