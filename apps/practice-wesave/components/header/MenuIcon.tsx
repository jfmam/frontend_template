import Image from 'next/image';
import { ButtonHTMLAttributes, useState, MouseEvent } from 'react';
import styles from '@/styles/button.module.scss';
import cn from 'classnames/bind';
import useMediaQuery from '@/hooks/useMediaQuery';

const btnStyles = cn.bind(styles);

interface MenuIconProps {
  isOpen: boolean;
}
export default function MenuIcon({ isOpen, ...props }: MenuIconProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const isLarge = useMediaQuery('(min-width: 425px)');

  return (
    <button className={btnStyles('menu')} {...props}>
      <Image
        sizes="(max-width: 425px) 36px, 45px"
        width={isLarge ? 45 : 36}
        height={isLarge ? 43 : 36}
        src={isOpen ? '/menuclose.svg' : '/menu.svg'}
        alt="menu"
      />
    </button>
  );
}
