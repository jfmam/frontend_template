import React, { ButtonHTMLAttributes, MouseEvent } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

const btnStyles = cn.bind(styles);

interface TabselectorProps {
  children: string;
  isSelected: boolean;
}

export default function TabSelector({
  children,
  className,
  isSelected,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & TabselectorProps) {
  const clickBtn = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    if (onClick) onClick(e);
  };
  return (
    <button
      {...props}
      onClick={clickBtn}
      className={btnStyles('tab-selector', { 'tab-selector--selected': isSelected }, className)}
    >
      {children}
      <span className={btnStyles('tab-selector-circle', { 'tab-selector-circle--selected': isSelected })} />
    </button>
  );
}
