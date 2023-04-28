import { ButtonHTMLAttributes } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const btnStyles = cn.bind(styles);

export function PrimaryBtn({ children, className, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button disabled={disabled} className={btnStyles('primary', { disabled: disabled }, className)} {...props}>
      {children}
    </button>
  );
}
