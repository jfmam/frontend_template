import React from 'react';
import cn from 'classnames/bind';
import btnStyles from '@/styles/button.module.scss';
import checkmarkStyles from '@/styles/checkmark.module.scss';

const btnCx = cn.bind(btnStyles);
const checkmarkCx = cn.bind(checkmarkStyles);

export default function CheckSelector() {
  return (
    <button className={btnCx('check-selector')}>
      <span className={checkmarkCx('checkmark')} />
    </button>
  );
}
