import Image from 'next/image';
import { ButtonHTMLAttributes, useState, MouseEvent } from 'react';
import styles from '@/styles/button.module.scss';
import cn from 'classnames/bind';

const btnStyles = cn.bind(styles);

interface MenuIconProps {
  isOpen: boolean;
}
export default function MenuIcon({ isOpen, ...props }: MenuIconProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={btnStyles('menu')} {...props}>
      <Image width={45} height={43} src={isOpen ? 'menuclose.svg' : 'menu.svg'} alt="menu" />
    </button>
  );
}
