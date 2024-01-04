import { useLayoutEffect, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAccessToken } from '@/utils';

interface Props {
  children: ReactElement;
}

export default function AuthentiacationLayout({ children }: Props) {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const token = getAccessToken();

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return children;
}
