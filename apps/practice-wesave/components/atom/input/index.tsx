import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames/bind';

import styles from '@/styles/input.module.scss';

const inputStyles = cn.bind(styles);

interface InputProps {
  isError?: boolean;
}

export default function Input({ className, isError, ...props }: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={inputStyles('input', { error: isError }, { default: className === undefined }, className)}
      {...props}
    />
  );
}
