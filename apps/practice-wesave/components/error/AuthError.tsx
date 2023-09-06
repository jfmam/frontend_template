import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthError() {
  const router = useRouter();
  useEffect(() => {
    toast('로그인이 필요합니다.', {
      icon: '⚠️',
    });
    router.push('/login');
  }, [router]);

  return <Toaster position="top-center" />;
}
