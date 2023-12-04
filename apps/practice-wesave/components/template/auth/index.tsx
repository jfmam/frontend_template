import { PropsWithChildren, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

interface AuthProps {}

export default function WithAuth({ children }: PropsWithChildren<AuthProps>) {
  const [cookies] = useCookies();
  const router = useRouter();

  useEffect(() => {
    if (!cookies.token) router.push('/login');
  }, [cookies.token, router]);
  return <>{children}</>;
}
