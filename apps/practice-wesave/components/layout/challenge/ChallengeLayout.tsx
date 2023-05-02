import { ReactNode } from 'react';
import Slider from 'react-slick';
import cn from 'classnames/bind';
import styles from '@/styles/ChallengeLayout.module.scss';

import ChallengeMenu from './ChallengeMenu';

interface ChallengeLayoutProps {
  children: ReactNode;
}

const layoutStyles = cn.bind(styles);

export default function ChallengeLayout({ children }: ChallengeLayoutProps) {
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      <ChallengeMenu />
      <div>{children}</div>
    </Slider>
  );
}
