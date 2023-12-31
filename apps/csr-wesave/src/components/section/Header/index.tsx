import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames/bind';
import styles from '@/styles/Header.module.scss';

import { MenuIcon } from '../../atom';

const NavigationModal = lazy(() => import('@/components/section/Modal/navigation/NavigationModal'));

const headerStyle = cn.bind(styles);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useNavigate();

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={headerStyle('header', { 'menu-open': isOpen })}>
        <div>
          <button onClick={() => router('/')} className={headerStyle('logo')}>
            <img width="100%" height="100%" sizes="(max-width: 425px) 115px, 152px" src="/logo.svg" alt="logo" />
          </button>
          <MenuIcon
            isOpen={isOpen}
            onClick={() => {
              setIsOpen(toggle => !toggle);
            }}
          />
        </div>
      </header>
      {isOpen && (
        <Suspense>
          <NavigationModal isOpen={isOpen} onCloseModal={onClose} />
        </Suspense>
      )}
    </>
  );
}
