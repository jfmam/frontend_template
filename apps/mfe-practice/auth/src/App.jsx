import React, { useState } from 'react';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';

const App = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  const handleSubmit = event => {
    event.preventDefault();
    // 실제 인증 로직 대신, 일단은 UI만 동작하도록 비워 둡니다.
  };

  const isLogin = mode === 'login';

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
