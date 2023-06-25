import Modal from 'react-modal';
import cn from 'classnames/bind';
import { AchivementResponse } from '@/common/achievement';
import styles from '@/styles/MyAchievementDetail.module.scss';

import ListItemLayout from '../layout/ListItemLayout';

import Badge from './Badge/Badge';
import { useMediaQuery } from 'react-responsive';

interface AchievementStatusDetail {
  item: AchivementResponse;
  isOpen: boolean;
  onRequestClose: () => void;
}

const cx = cn.bind(styles);

export default function MyAchievementDetail({ item, isOpen, onRequestClose }: AchievementStatusDetail) {
  const isDesktop = useMediaQuery({
    query: '(min-width: 504px)',
  });
  const { actionDay, badge, completedRatio, goal, name, type } = item;
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} shouldCloseOnEsc className={cx('container')}>
      <div>
        <Badge height={isDesktop ? 456 : 250} width={isDesktop ? 456 : 250} type={badge} />
      </div>
      <div className={cx('info')}>
        <ListItemLayout
          disabled
          actionDay={actionDay}
          completedRatio={completedRatio}
          goal={goal}
          name={name}
          type={type}
        />
      </div>
    </Modal>
  );
}
