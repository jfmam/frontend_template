import Image from 'next/image';
import Modal from 'react-modal';
import cn from 'classnames/bind';
import { AchivementResponse } from '@/common';
import { ListItemLayout } from '@/components/section';
import styles from '@/styles/MyAchievementDetail.module.scss';

interface AchievementStatusDetail {
  item: AchivementResponse;
  isOpen: boolean;
  onRequestClose: () => void;
}

const cx = cn.bind(styles);

export default function MyAchievementDetail({ item, isOpen, onRequestClose }: AchievementStatusDetail) {
  const { actionDay, badge, goal, name, type } = item;
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} shouldCloseOnEsc className={cx('container')}>
      <div className={cx('image')}>
        <Image sizes="(max-width: 504px) 250px, 456px" fill src={`/${badge}.svg`} alt={name} />
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
