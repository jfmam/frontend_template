import { useState } from 'react';
import Modal from 'react-modal';
import cn from 'classnames/bind';
import styles from '@/styles/BadgeModal.module.scss';
import useMediaQuery from '@/hooks/useMediaQuery';

import { badges } from '../Challenge/Form/constants';
import Badge, { BadgeType } from '../button/Badge';
import { PrimaryBtn } from '../button/PrimaryBtn';

Modal.setAppElement('main');
const modalStyles = cn.bind(styles);

interface BadgeModalProps {
  isOpen: boolean;
  onRequestClose?: () => void;
  onClickSelectBtn: (badge: BadgeType | null) => void;
  oldSelectedBadge: BadgeType | null;
}

export default function BadgeModal({ isOpen, onRequestClose, onClickSelectBtn, oldSelectedBadge }: BadgeModalProps) {
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [newSelectedBadge, setNewSelectedBadge] = useState<BadgeType | null>(oldSelectedBadge);

  const calcImageSize = () => {
    if (isDesktop) return 'large';
    if (isMobile) return 'small';

    return 'medium';
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      className={modalStyles('badge-modal')}
      bodyOpenClassName={modalStyles('overlay')}
    >
      <div className={modalStyles('badge-container')}>
        {badges.map(badge => (
          <Badge
            onClick={() => setNewSelectedBadge(badge)}
            lengthType={calcImageSize()}
            isSelected={newSelectedBadge === badge}
            type={badge}
            key={badge}
          />
        ))}
      </div>
      <div className={modalStyles('button-container')}>
        <PrimaryBtn onClick={() => onClickSelectBtn(newSelectedBadge)}>선택</PrimaryBtn>
      </div>
    </Modal>
  );
}
