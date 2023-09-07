import React from 'react';
import cn from 'classnames/bind';
import btnStyles from '@/styles/button.module.scss';
import checkmarkStyles from '@/styles/checkmark.module.scss';

const btnCx = cn.bind(btnStyles);
const checkmarkCx = cn.bind(checkmarkStyles);

interface CheakSelectorProps {
  isSelect: boolean;
  onClick: () => void;
}

export default function CheckSelector({ isSelect, onClick }: CheakSelectorProps) {
  return (
    <button onClick={onClick} className={btnCx('check-selector', { 'check-selector--selected': isSelect })}>
      <span className={checkmarkCx('checkmark', { 'checkmark--selected': isSelect })} />
    </button>
  );
}
