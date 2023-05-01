import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

import TabSelector from './TabSelector';

const btnStyles = cn.bind(styles);

export function TextBtn({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={btnStyles('text', className)} {...props}>
      {children}
    </button>
  );
}

export function SelectorBtn({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles['btn--selector']} {...props}>
      {children}
    </button>
  );
}

export function checkSelectorBtn({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles['btn--check-selector']} {...props}>
      {children}
    </button>
  );
}
