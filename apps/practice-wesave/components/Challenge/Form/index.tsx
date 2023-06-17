import { useState } from 'react';
import { Form, Formik, Field } from 'formik';
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

import { badges, days } from './constants';
import { useRegistChallenges } from '@/hooks/quries/challenge/useRegistChallenges';

const badgeCx = cn.bind(badgeStyles);
const cx = cn.bind(styles);

export type InitialValuesType = {
  challengeName: string;
  challengeType: 'save' | 'spend';
  goal: string;
  deadline: string;
};

const registerSchema = yup.object().shape({
  challengeName: yup.string().max(20).required('Required'),
  goal: yup.string().max(20).required('required'),
  deadline: yup.string().required('required'),
});

export default function ChallengeCreateForm() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedbadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [badgeList, setBadgeList] = useState<BadgeType[]>(badges);
  const { mutate, isLoading } = useRegistChallenges();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const initialValues: InitialValuesType = {
    challengeName: '',
    challengeType: 'save',
    deadline: '',
    goal: '',
  };

  const onClickDaySelector = (day: string) => {
    if (selectedDays.includes(day)) {
      return setSelectedDays(prevDays => prevDays.filter(d => d !== day));
    }

    setSelectedDays(prevDays => prevDays.concat(day));
  };

  const onClickBadge = (selectBadge: BadgeType) => {
    if (selectBadge === selectedbadge) {
      return setSelectedBadge(null);
    }

    setSelectedBadge(selectBadge);

    if (isOpenModal) {
      setBadgeList(prevBadges => {
        const updatedBadges = prevBadges.filter(v => v !== selectBadge);
        updatedBadges.unshift(selectBadge);
        return updatedBadges;
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={({ challengeName, challengeType, deadline, goal }: InitialValuesType) => {
        mutate({
          actionDay: selectedDays,
          badge: selectedbadge,
          endDate: deadline,
          startDate: deadline,
          name: challengeName,
          type: challengeType,
          goal: goal,
        });
      }}
    >
      {({ values, setFieldValue, submitForm }) => (
        <>
          <Form className={cx('form')}>
            <div>
              <label className={cx('label')} htmlFor="name">
                챌린지 이름
              </label>
              <Field
                maxLength={20}
                id="name"
                name="challengeName"
                className={cx('field')}
                placeholder="야식 줄이고 돈 모으기"
                as={Input}
              />
            </div>
            <div>
              <div>
                <Tabselector
                  onClick={() => setFieldValue('challengeType', 'save')}
                  isSelected={values.challengeType === 'save'}
                  className={cx('label')}
                >
                  돈모으기
                </Tabselector>
                <Tabselector
                  onClick={() => setFieldValue('challengeType', 'spend')}
                  isSelected={values.challengeType === 'spend'}
                  className={cx('label')}
                >
                  물건사기
                </Tabselector>
              </div>
              <Field maxLength={20} name="goal" placeholder="직접 입력" as={Input} className={cx('field')} />
            </div>
            <div>
              <label htmlFor="deadline" className={cx('label')}>
                기간 & 실천요일
              </label>
              <Field
                id="deadline"
                name="deadline"
                placeholder="2021.11.15 ~ 2021.11.29"
                as={Input}
                className={cx('field')}
              />
              <div className={cx('days-container')}>
                {days.map(day => (
                  <DaySelector onClick={() => onClickDaySelector(day)} key={day} day={day} />
                ))}
              </div>
            </div>
            <div>
              <label className={cx('label')}>뱃지 선택</label>
              <div className={cx('badge-container')}>
                {badgeList.slice(0, 3).map(badge => (
                  <Badge
                    onClick={() => onClickBadge(badge)}
                    isSelected={selectedbadge === badge}
                    type={badge}
                    key={badge}
                  />
                ))}
                <button onClick={() => setIsOpenModal(true)} className={badgeCx('badge')}>
                  더 보기
                </button>
              </div>
            </div>
            <div className={cx('confirm-btn-container')}>
              <PrimaryBtn onClick={submitForm} type="submit" disabled={isLoading} className={cx('confirm-btn')}>
                만들기
              </PrimaryBtn>
            </div>
          </Form>
          <BadgeModal
            isOpen={isOpenModal}
            onRequestClose={() => setIsOpenModal(false)}
            oldSelectedBadge={selectedbadge}
            onClickSelectBtn={(badge: BadgeType) => onClickBadge(badge)}
          />
        </>
      )}
    </Formik>
  );
}
