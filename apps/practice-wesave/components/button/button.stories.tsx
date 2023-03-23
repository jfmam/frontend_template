import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames/bind';

import styles from '@/styles/button.module.scss';

import TabSelector from './TabSelector';
import CheckSelector from './CheckSelector';

const btnStyles = cn.bind(styles);

export default {
  title: 'Components/Button',
};

export const PrimaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('primary')} {...props}>
    primary button
  </button>
);

export const TextButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('text')} {...props}>
    Text button
  </button>
);

export const SelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('selector')} {...props}>
    Selector button
  </button>
);

export const TabSelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <TabSelector {...props}>tab selector</TabSelector>
);

export const CheckSelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <CheckSelector />;
