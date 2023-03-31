import Image from 'next/image';
import styles from '@/styles/header.module.scss';
import cn from 'classnames/bind';

import { useModalDispatch, useModalState } from '../Modal/ModalContext';

import MenuIcon from './MenuIcon';

const headerStyle = cn.bind(styles);

export default function Header() {
  const state = useModalState();
  const dispatch = useModalDispatch();

  return (
    <header className={headerStyle('header', { 'menu-open': state })}>
      <div>
        <Image src="/logo.svg" alt="logo" width={152} height={40} />
        <span>
          <MenuIcon
            isOpen={state}
            onClick={() => {
              dispatch(toggle => !toggle);
            }}
          />
        </span>
      </div>
    </header>
  );
}
