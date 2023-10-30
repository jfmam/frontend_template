import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/Header.module.scss';

import { MenuIcon } from '../../atom';

const NavigationModal = dynamic(() => import('@/components/section/Modal/navigation/NavigationModal'), { ssr: false });

const headerStyle = cn.bind(styles);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={headerStyle('header', { 'menu-open': isOpen })}>
        <div>
          <button onClick={() => router.push('/')} className={headerStyle('logo')}>
            <Image fill sizes="(max-width: 425px) 115px, 152px" src="/logo.svg" alt="logo" />
          </button>
          <MenuIcon
            isOpen={isOpen}
            onClick={() => {
              setIsOpen(toggle => !toggle);
            }}
          />
        </div>
      </header>
      {isOpen && <NavigationModal isOpen={isOpen} onCloseModal={onClose} />}
    </>
  );
}
