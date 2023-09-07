import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';
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
