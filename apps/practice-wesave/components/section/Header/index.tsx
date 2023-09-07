import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames/bind';
import styles from '@/styles/Header.module.scss';

import { useModalDispatch, useModalState } from '../../section/Modal/navigation/NavigationModalContext';
import { MenuIcon } from '../../atom';

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
