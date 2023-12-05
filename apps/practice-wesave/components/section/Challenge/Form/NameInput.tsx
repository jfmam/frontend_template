import { FormikHandlers } from 'formik';
import cn from 'classnames/bind';

import { Input } from '@/components/atom';
import styles from '@/styles/ChallengeCreateForm.module.scss';

interface NameInputProps {
  handleChange: FormikHandlers['handleChange'];
}

const cx = cn.bind(styles);

export default function NameInput({ handleChange }: NameInputProps) {
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
