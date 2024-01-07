export default function KakaoLoginButton() {

  return (
    <a
      href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_KAKAO_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}`}
    >
        <img width={64} height={64} src={`/kakao.svg`} alt={`kakao login button`}></img>
    </a>
  );
}
