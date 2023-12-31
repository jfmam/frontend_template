import { PropsWithChildren, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

interface AuthProps {}

export default function WithAuth({ children }: PropsWithChildren<AuthProps>) {
  const [cookies] = useCookies();
  const router = useNavigate();

  useEffect(() => {
    if (!cookies.token) router('/login');
  }, [cookies.token, router]);
  return <>{children}</>;
}
