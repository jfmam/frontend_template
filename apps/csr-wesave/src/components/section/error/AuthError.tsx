import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthError() {
  const router = useNavigate();
  useEffect(() => {
    toast('로그인이 필요합니다.', {
      icon: '⚠️',
    });
    router('/login');
  }, [router]);

  return <Toaster position="top-center" />;
}
