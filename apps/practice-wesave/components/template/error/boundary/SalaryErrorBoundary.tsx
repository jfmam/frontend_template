import { useRouter } from 'next/router';
import { ReactNode, useLayoutEffect } from 'react';

interface Props {
  children: ReactNode;
}

export default function SalaryErrorBoundary({ children }: Props) {
  const router = useRouter();

  useLayoutEffect(() => {
    if (!localStorage.getItem('income')) {
      router.push('/salary');
    }
  }, [router]);

  return children;
}
