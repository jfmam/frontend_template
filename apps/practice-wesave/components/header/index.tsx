import Image from 'next/image';
import styles from '@/styles/header.module.scss';
import cn from 'classnames/bind';
import { useRouter } from 'next/router';

import { useModalDispatch, useModalState } from '../Modal/NavigationModalContext';

import { MenuIcon } from '../atom';

const headerStyle = cn.bind(styles);

export default function Header() {
  const state = useModalState();
  const dispatch = useModalDispatch();
  const router = useRouter();

  return (
    <header className={headerStyle('header', { 'menu-open': state })}>
      <div>
        <button onClick={() => router.push('/')} className={headerStyle('logo')}>
          <Image fill sizes="(max-width: 425px) 115px, 152px" src="/logo.svg" alt="logo" />
        </button>
        <MenuIcon
          isOpen={state}
          onClick={() => {
            dispatch(toggle => !toggle);
          }}
        />
      </div>
    </header>
  );
}
