import React, { ButtonHTMLAttributes, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/button.module.scss';

import TabSelector from './TabSelector';
import CheckSelector from './CheckSelector';
import Badge, { BadgeType } from './Badge';
import DaySelector from './DaySelector';

const btnStyles = cn.bind(styles);

export default {
  title: 'Components/Button',
};

export const PrimaryButton = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('primary', className)} {...props}>
    primary button
  </button>
);

export const TextButton = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('text', className)} {...props}>
    Text button
  </button>
);

export const SelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={btnStyles('selector')} {...props}>
    Selector button
  </button>
);

export const TabSelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [isSelecetd, setIsSelecetd] = useState(false);
  return (
    <TabSelector onClick={() => setIsSelecetd(origin => !origin)} isSelected={isSelecetd} {...props}>
      tab selector
    </TabSelector>
  );
};

export const CheckSelectorButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <CheckSelector />;

export const BadgeButton = () => {
  const badges: BadgeType[] = ['art', 'award', 'game', 'health', 'money', 'pig', 'present', 'rocket', 'target'];

  return (
    <>
      {badges.map(v => (
        <Badge key={v} type={v} onClick={() => {}} />
      ))}
    </>
  );
};

export const DaySelectorButton = () => {
  return <DaySelector day="월" />;
};
