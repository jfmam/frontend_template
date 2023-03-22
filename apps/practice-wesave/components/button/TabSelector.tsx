import React, { ButtonHTMLAttributes, Children } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const btnStyles = cn.bind(styles);

interface TabselectorProps {
  children: string;
}

export default function TabSelector({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & TabselectorProps) {
  return (
    <button className={btnStyles('tab-selector')} {...props}>
      {children}
      <span className={btnStyles('tab-selector-circle')} />
    </button>
  );
}
