import { useEffect, useState, lazy } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FormikProps } from 'formik';
import cn from 'classnames/bind';
import { PrimaryBtn, Badge, TabSelector, DaySelector, Input } from '@/components/atom';
import badgeStyles from '@/styles/Badge.module.scss';
import styles from '@/styles/ChallengeCreateForm.module.scss';
import { Challenge, BadgeType } from '@/common';

const BadgeModal = lazy(() => import('@/components/section/Modal/BadgeModal'));

import { badges, days } from './constants';

const badgeCx = cn.bind(badgeStyles);
const cx = cn.bind(styles);

export type InitialValuesType = Challenge & { badge: BadgeType | null };

interface ChallengeCreateFormProps {
  isLoading: boolean;
  isError: boolean;
  formik: FormikProps<InitialValuesType>;
}

export default function ChallengeCreateForm({ isLoading, isError, formik }: ChallengeCreateFormProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [badgeList, setBadgeList] = useState<BadgeType[]>(badges);
  const { dirty, setFieldValue, handleChange, handleSubmit, values, errors } = formik;

  const onClickDaySelector = (day: string) => {
    if (formik.values.actionDay.includes(day)) {
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

  useEffect(() => {
    if (isError) {
      toast.error('챌린지 생성에 실패하였습니다.');
    }
  }, [isError]);

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
            <TabSelector
              onClick={() => setFieldValue('type', 'save')}
              isSelected={values.type === 'save'}
              className={cx('label')}
            >
              돈모으기
            </TabSelector>
            <TabSelector
              onClick={() => setFieldValue('type', 'spend')}
              isSelected={values.type === 'spend'}
              className={cx('label')}
            >
              물건사기
            </TabSelector>
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
            {!isError ? '만들기' : '재시도'}
          </PrimaryBtn>
        </div>
      </form>
      <BadgeModal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        oldSelectedBadge={values.badge}
        onClickSelectBtn={(badge: BadgeType) => onClickBadge(badge)}
      />
      {isError && <Toaster position="top-center" />}
    </>
  );
}
