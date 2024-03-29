import Modal from 'react-modal';
import cn from 'classnames/bind';
import { differenceInDays } from 'date-fns';
import { AchivementResponse } from '@/common';
import styles from '@/styles/AchievementStatusDetail.module.scss';

import { convertIsoDate, dueDay } from '../../utils/day';

interface AchievementStatusDetail {
  item: AchivementResponse;
  isOpen: boolean;
  onRequestClose: () => void;
}

const cx = cn.bind(styles);

export default function AchievementStatusDetail({ item, isOpen, onRequestClose }: AchievementStatusDetail) {
  const { actionDay, badge, completeRatio, goal, name, startDate, endDate, type } = item;
  const dDay = differenceInDays(new Date(endDate), new Date());
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} shouldCloseOnEsc className={cx('container')}>
      <div>
        <img height={110} width={110} src={`/${badge}.svg`} alt="" />
      </div>
      <div className={cx('info')}>
        <div className={cx('info-name')}>{name}</div>
        <div className={cx('info-goal')}>
          <span>{type === 'save' ? `${goal}원` : goal}</span>
          <span>{dueDay(actionDay)}</span>
        </div>
      </div>
      <div className={cx('date-container')}>
        <div>
          <div className={cx('d-day')}>{`D-${dDay}`}</div>
          <div className={cx('date')}>{`${convertIsoDate(startDate)} - ${convertIsoDate(endDate)}`}</div>
        </div>
        <div className={cx('complete')}>{completeRatio}%</div>
      </div>
    </Modal>
  );
}
