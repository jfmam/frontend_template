import React, { useState } from "react";
import "./styles.css";

const App = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  const handleSubmit = (event) => {
    event.preventDefault();
    // 실제 인증 로직 대신, 일단은 UI만 동작하도록 비워 둡니다.
  };

  const isLogin = mode === "login";

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-chip">
          <span className="auth-chip-dot" />
          <span>Secure workspace</span>
        </div>
        <h1 className="auth-title">MFE Auth</h1>
        <p className="auth-subtitle">
          대시보드에 들어가기 전에 계정을 확인해 주세요. UI만 구현되어 있고, 데이터는 저장되지
          않습니다.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            회원가입
          </button>
        </div>

        <form id="auth-form" className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label">
            이메일<span>*</span>
            <input
              className="field-input"
              type="email"
              required
              placeholder="you@example.com"
            />
          </label>

          <label className="field-label">
            비밀번호<span>*</span>
            <input
              className="field-input"
              type="password"
              required
              placeholder="8자 이상, 숫자/문자 조합"
            />
          </label>

          {!isLogin && (
            <label className="field-label">
              비밀번호 확인<span>*</span>
              <input
                className="field-input"
                type="password"
                required
                placeholder="비밀번호를 한 번 더 입력"
              />
            </label>
          )}

          {isLogin && (
            <div className="auth-footer-row">
              <label className="field-label">
                <input type="checkbox" style={{ marginRight: 6 }} />
                자동 로그인
              </label>
              <span className="auth-link">비밀번호를 잊으셨나요?</span>
            </div>
          )}
        </form>

        <div className="auth-actions">
          <button
            type="submit"
            form="auth-form"
            className="auth-button-primary"
          >
            {isLogin ? "로그인" : "계정 만들기"}
          </button>
          <button type="button" className="auth-button-ghost">
            GitHub 계정으로 계속하기
          </button>
          <p className="auth-hint">
            이 화면은 마이크로 프론트엔드 연습용으로, 실제 인증 API와는 연결되어 있지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
