export default function KakaoLoginButton() {

  return (
    <a
      href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_KEY}&redirect_uri=${process.env.REACT_APP_NAVER_REDIRECT_URI}`}
    >
      <img width={64} height={64} src={`/naver.svg`} alt={`naver login button`}></img>
    </a>
  );
}
