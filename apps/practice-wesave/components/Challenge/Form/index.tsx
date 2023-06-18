import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames/bind';
import { PrimaryBtn } from '@/components/button/PrimaryBtn';
import Tabselector from '@/components/button/TabSelector';
import Badge, { BadgeType } from '@/components/button/Badge';
import DaySelector from '@/components/button/DaySelector';
import badgeStyles from '@/styles/Badge.module.scss';
import Input from '@/components/input';
import styles from '@/styles/ChallengeCreateForm.module.scss';
import BadgeModal from '@/components/Modal/BadgeModal';
import { useRegistChallenges } from '@/hooks/quries/challenge/useRegistChallenges';
import { Challenge } from '@/common/challenge';

import { badges, days } from './constants';

const badgeCx = cn.bind(badgeStyles);
const cx = cn.bind(styles);

type InitialValuesType = Challenge & { badge: BadgeType | null };

const registerSchema = yup.object().shape({
  name: yup.string().max(20).required('챌린지 이름을 작성해 주세요.'),
  goal: yup.string().max(20).required('목표를 설정해 주세요.'),
  actionDay: yup.array().min(1, '최소 1개이상 선택하야 합니다.'),
  badge: yup.string().required('뱃지를 선택해 주세요'),
});

export default function ChallengeCreateForm() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [badgeList, setBadgeList] = useState<BadgeType[]>(badges);
  const { mutate, isLoading } = useRegistChallenges();
  const { handleSubmit, values, handleChange, setFieldValue, errors, dirty } = useFormik<InitialValuesType>({
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
      mutate(challenge, {
        onSuccess: () => resetForm(),
      });
    },
    validationSchema: registerSchema,
  });

  const onClickDaySelector = (day: string) => {
    if (values.actionDay.includes(day)) {
      setFieldValue(
        'actionDay',
        values.actionDay.filter(d => d !== day),
      );
      return;
    }

    setFieldValue('actionDay', values.actionDay.concat(day));
  };

  const onClickBadge = (selectBadge: BadgeType) => {
    if (selectBadge === values.badge) {
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
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={cx('form')}>
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
        <div>
          <div>
            <Tabselector
              onClick={() => setFieldValue('type', 'save')}
              isSelected={values.type === 'save'}
              className={cx('label')}
            >
              돈모으기
            </Tabselector>
            <Tabselector
              onClick={() => setFieldValue('type', 'spend')}
              isSelected={values.type === 'spend'}
              className={cx('label')}
            >
              물건사기
            </Tabselector>
          </div>
          <Input required maxLength={20} name="goal" placeholder="직접 입력" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="deadline" className={cx('label')}>
            기간 & 실천요일
          </label>
          <Input id="deadline" name="deadline" placeholder="2021.11.15 ~ 2021.11.29" onChange={handleChange} required />
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
        <div>
          <label className={cx('label')}>뱃지 선택</label>
          <div className={cx('badge-container')}>
            {badgeList.slice(0, 3).map(badge => (
              <Badge onClick={() => onClickBadge(badge)} isSelected={values.badge === badge} type={badge} key={badge} />
            ))}
            <button onClick={() => setIsOpenModal(true)} className={badgeCx('badge')}>
              더 보기
            </button>
          </div>
        </div>
        <div className={cx('confirm-btn-container')}>
          <PrimaryBtn
            type="submit"
            disabled={Object.keys(errors).length > 0 || isLoading || !dirty}
            className={cx('confirm-btn')}
          >
            만들기
          </PrimaryBtn>
        </div>
      </form>
      <BadgeModal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        oldSelectedBadge={values.badge}
        onClickSelectBtn={(badge: BadgeType) => onClickBadge(badge)}
      />
    </>
  );
}
