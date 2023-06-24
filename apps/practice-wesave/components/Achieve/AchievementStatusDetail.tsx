import Modal from 'react-modal';
import cn from 'classnames/bind';
import { differenceInDays } from 'date-fns';
import { AchivementResponse } from '@/common/achievement';
import styles from '@/styles/AchievementStatusDetail.module.scss';

import Badge from './Badge/Badge';
import { convertIsoDate, dueDay } from '../utils/day';

interface AchievementStatusDetail {
  item: AchivementResponse;
  isOpen: boolean;
  onRequestClose: () => void;
}

const cx = cn.bind(styles);

export default function AchievementStatusDetail({ item, isOpen, onRequestClose }: AchievementStatusDetail) {
  const { actionDay, badge, completedRatio, goal, name, startDate, endDate, type } = item;
  const dDay = differenceInDays(new Date(endDate), new Date());
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} shouldCloseOnEsc className={cx('container')}>
      <div>
        <Badge height={110} width={110} type={badge} />
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
        <div className={cx('complete')}>{completedRatio}%</div>
      </div>
    </Modal>
  );
}
