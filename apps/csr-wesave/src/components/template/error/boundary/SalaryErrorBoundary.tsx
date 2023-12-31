import { useNavigate } from 'react-router-dom';
import { ReactNode, useLayoutEffect } from 'react';

interface Props {
  children: ReactNode;
}

export default function SalaryErrorBoundary({ children }: Props) {
  const router = useNavigate();

  useLayoutEffect(() => {
    if (!localStorage.getItem('income')) {
      router('/salary');
    }
  }, [router]);

  return children;
}
