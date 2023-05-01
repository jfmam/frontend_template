import { Form, Formik, Field } from 'formik';
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
import { useState } from 'react';

const badgeCx = cn.bind(badgeStyles);
const cx = cn.bind(styles);

type InitialValuesType = {
  challengeName: string;
  challengeType: 'save' | 'spend';

  deadline: string;
  dueDate: string;
  badge: BadgeType | null;
};

export default function ChallengeCreateForm() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const initialValues: InitialValuesType = {
    challengeName: '',
    challengeType: 'save',
    deadline: '',
    dueDate: '',
    badge: null,
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <>
            <Form className={cx('form')}>
              <div>
                <label className={cx('label')} htmlFor="challengeName">
                  챌린지 이름
                </label>
                <Field name="challengeName" className={cx('field')} placeholder="야식 줄이고 돈 모으기" as={Input} />
              </div>
              <div>
                <div>
                  <Tabselector
                    onClick={() => setFieldValue('type', 'save')}
                    isSelected={values.challengeType === 'save'}
                    className={cx('label')}
                  >
                    돈모으기
                  </Tabselector>
                  <Tabselector
                    onClick={() => setFieldValue('type', 'spend')}
                    isSelected={values.challengeType === 'spend'}
                    className={cx('label')}
                  >
                    물건사기
                  </Tabselector>
                </div>
                <Field name="name" placeholder="직접 입력" as={Input} className={cx('field')} />
              </div>
              <div>
                <label className={cx('label')}>기간 & 실천요일</label>
                <Field name="type" placeholder="야식 줄이고 돈 모으기" as={Input} className={cx('field')} />
                <div className={cx('days-container')}>
                  {days.map(day => (
                    <DaySelector key={day} day={day} />
                  ))}
                </div>
              </div>
              <div>
                <label className={cx('label')}>뱃지 선택</label>
                <div className={cx('badge-container')}>
                  {badges.slice(0, 3).map(badge => (
                    <Badge type={badge} key={badge} />
                  ))}
                  <button onClick={() => setIsOpenModal(true)} className={badgeCx('badge')}>
                    더 보기
                  </button>
                </div>
              </div>
              <div>
                <PrimaryBtn className={cx('confirm-btn')}>만들기</PrimaryBtn>
              </div>
            </Form>
            <BadgeModal
              isOpen={isOpenModal}
              onRequestClose={() => setIsOpenModal(false)}
              oldSelectedBadge={values.badge}
              onClickSelectBtn={(badge: BadgeType | null) => setFieldValue('badge', badge)}
            />
          </>
        )}
      </Formik>
    </>
  );
}
