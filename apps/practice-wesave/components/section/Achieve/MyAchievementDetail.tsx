import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import cn from 'classnames/bind';
import { AchivementResponse } from '@/common';
import { ListItemLayout } from '@/components/section';
import { BadgeImage } from '@/components/atom';
import styles from '@/styles/MyAchievementDetail.module.scss';

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
  const { actionDay, badge, goal, name, type } = item;
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} shouldCloseOnEsc className={cx('container')}>
      <div>
        <BadgeImage height={isDesktop ? 456 : 250} width={isDesktop ? 456 : 250} type={badge} />
      </div>
      <div className={cx('info')}>
        <ListItemLayout>
          <ListItemLayout.Name name={name} />
          <ListItemLayout.Detail actionDay={actionDay} goal={goal} type={type} completedRatio={100} disabled />
          <ListItemLayout.ComplteRatio completedRatio={100} />
        </ListItemLayout>
      </div>
    </Modal>
  );
}
