import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames/bind';

import styles from '@/styles/input.module.scss';

const inputStyles = cn.bind(styles);

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputStyles('input')} {...props} />;
}
