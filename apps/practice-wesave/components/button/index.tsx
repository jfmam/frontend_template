import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from '@/styles/button.module.scss';

import TabSelector from './TabSelector';

export function PrimaryBtn({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(styles['btn--primary'], className?.split(' '))} {...props}>
      {children}
    </button>
  );
}

export function TextBtn({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(styles['btn--text'], className)} {...props}>
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

export function TabSelectorBtn({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <TabSelector {...props}>tab selector</TabSelector>;
}

export function checkSelectorBtn({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles['btn--check-selector']} {...props}>
      {children}
    </button>
  );
}
