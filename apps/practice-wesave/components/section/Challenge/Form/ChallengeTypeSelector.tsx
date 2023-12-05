import cn from 'classnames/bind';
import { FormikHandlers, FormikHelpers } from 'formik';

import { Input, TabSelector } from '@/components/atom';
import styles from '@/styles/ChallengeCreateForm.module.scss';

const cx = cn.bind(styles);

interface ChallengeTypeSelectorProps {
  setFieldValue: FormikHelpers<unknown>['setFieldValue'];
  type: string;
  handleChange: FormikHandlers['handleChange'];
}

export default function ChallengeTypeSelector({ setFieldValue, type, handleChange }: ChallengeTypeSelectorProps) {
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
