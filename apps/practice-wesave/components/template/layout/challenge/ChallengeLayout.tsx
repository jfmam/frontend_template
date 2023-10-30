import { ReactNode } from 'react';
// import Slider from 'react-slick';
import dynamic from 'next/dynamic';

import { ChallengeNavigationMenu } from '../../../section';

const Slider = dynamic(() => import('react-slick'));

interface ChallengeLayoutProps {
  children: ReactNode;
}

export default function ChallengeLayout({ children }: ChallengeLayoutProps) {
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 2,
    adaptiveHeight: true,
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
      <ChallengeNavigationMenu />
      <>{children}</>
    </Slider>
  );
}
