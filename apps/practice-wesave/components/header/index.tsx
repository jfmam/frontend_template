import Image from 'next/image';
import styles from '@/styles/header.module.scss';
import cn from 'classnames/bind';

import { useModalDispatch, useModalState } from '../Modal/NavigationModalContext';

import MenuIcon from './MenuIcon';
import useMediaQuery from '@/hooks/useMediaQuery';

const headerStyle = cn.bind(styles);

export default function Header() {
  const state = useModalState();
  const dispatch = useModalDispatch();
  const isLarge = useMediaQuery('(min-width: 425px)');

  return (
    <header className={headerStyle('header', { 'menu-open': state })}>
      <div>
        <Image
          sizes="(max-width: 425px) 115px, 152px"
          src="/logo.svg"
          alt="logo"
          width={isLarge ? 152 : 115}
          height={isLarge ? 40 : 30}
        />
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
