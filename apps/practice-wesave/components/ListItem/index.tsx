import React, { LiHTMLAttributes, useState } from 'react';
import cn from 'classnames/bind';
import styles from '@/styles/list-item.module.scss';

interface ListItemProps {
  name: string;
  targetAmount: number;
  targetPeriod: string[];
  percent: number;
}

const listItemStyle = cn.bind(styles);

export default function ListItem({
  name,
  targetAmount,
  targetPeriod,
  percent,
  onClick,
  ...props
}: ListItemProps & LiHTMLAttributes<HTMLLIElement>) {
  const [toggle, setToggle] = useState(false);

  const onClickBtn = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setToggle(origin => !origin);
    if (onClick) onClick(e);
  };

  return (
    <li className={listItemStyle('list-item', { complete: toggle })} onClick={onClickBtn} {...props}>
      <div className={listItemStyle('name')}>{name}</div>
      <div className={listItemStyle('detail')}>
        <div>
          <span className={listItemStyle('amount')}>{targetAmount}원</span>
          <span className={listItemStyle('period')}>{targetPeriod.toString().replace(/,/g, '·')}</span>
        </div>
        <span className={listItemStyle('percentage')}>{percent}%</span>
      </div>
    </li>
  );
}
