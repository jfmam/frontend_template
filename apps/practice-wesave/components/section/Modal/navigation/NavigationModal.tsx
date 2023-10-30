import Link from 'next/link';
import Modal from 'react-modal';
import cn from 'classnames/bind';
import styles from '@/styles/modal.module.scss';

Modal.setAppElement('#main');
const modalStyles = cn.bind(styles);

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
}

export default function MenuModal({ isOpen, onCloseModal }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCloseModal}
      shouldCloseOnEsc
      overlayClassName={modalStyles('overlay')}
      className={modalStyles('modal')}
    >
      <nav className={modalStyles('navigation-container')}>
        <Link onClick={() => onCloseModal()} className={modalStyles('navigation-item')} href="/">
          WESAVE
        </Link>
        <Link onClick={() => onCloseModal()} className={modalStyles('navigation-item')} href="/timer">
          Working-Timer
        </Link>
        <Link onClick={() => onCloseModal()} className={modalStyles('navigation-item')} href="/challenge">
          Challenge
        </Link>
        <Link onClick={() => onCloseModal()} className={modalStyles('navigation-item')} href="/mypage">
          My Page
        </Link>
      </nav>
    </Modal>
  );
}
