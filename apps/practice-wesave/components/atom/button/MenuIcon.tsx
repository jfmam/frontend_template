import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const btnStyles = cn.bind(styles);

interface MenuIconProps {
  isOpen: boolean;
}
export default function MenuIcon({ isOpen, ...props }: MenuIconProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={btnStyles('menu')} {...props}>
      <Image sizes="(max-width: 425px) 36px, 45px" fill src={isOpen ? '/menuclose.svg' : '/menu.svg'} alt="menu" />
    </button>
  );
}
