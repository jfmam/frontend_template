import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OAuthLogin } from '@/hooks/quries/user/useLogin';

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      Promise.resolve(OAuthLogin('kakao', code));
    }
  }, []);

  return null;
}
