import '@/styles/globals.scss';
import React, { Suspense, lazy, useState } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { Header } from './components/section';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthentiacationLayout from './components/template/layout/Auth';
import { ChallengeLayout } from './components/template';
import { getAccessToken } from './utils';

const ForgotPassword = lazy(() => import('./pages/forgot-password'));
const SignIn = lazy(() => import('./pages/login'));
const ResetPassword = lazy(() => import('./pages/reset-password'));
const Salary = lazy(() => import('./pages/salary'));
const SignUp = lazy(() => import('./pages/signup'));
const Timer = lazy(() => import('./pages/timer'));
const MyPage = lazy(() => import('./pages/mypage'));
const TodayChallenge = lazy(() => import('./pages/challenge/today-challenge'));
const AchievementStatus = lazy(() => import('./pages/challenge/achievement-status'));
const MyAchievement = lazy(() => import('./pages/challenge/my-achievement'));
const Register = lazy(() => import('./pages/challenge/register'));
const Home = lazy(() => import('./pages'));

const ChallengeRoutes = () => {
  const token = getAccessToken();

  return (
    <Routes>
      {!token ? (
        <Route path="*" element={<Navigate to="/login" />}></Route>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/challenge/today-challenge" />} />
          <Route path="today-challenge" element={<TodayChallenge />} />
          <Route path="achievement-status" element={<AchievementStatus />} />
          <Route path="my-achievement" element={<MyAchievement />} />
          <Route path="register" element={<Register />} />
        </>
      )}
    </Routes>
  );
};

const UserRoutes = () => {
  const token = getAccessToken();

  return (
    <Routes>
      {token ? (
        <Route path="*" element={<Navigate to="/" />}></Route>
      ) : (
        <>
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="login" element={<SignIn />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="signup" element={<SignUp />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            suspense: true,
          },
        },
      }),
  );
  return (
    <BrowserRouter>
      <Header />
      <QueryClientProvider client={queryClient}>
        <main id="main">
          <Suspense>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="salary" element={<Salary />} />
              <Route path="timer" element={<Timer />} />
              <Route
                path="mypage"
                element={
                  <AuthentiacationLayout>
                    <MyPage />
                  </AuthentiacationLayout>
                }
              />
              <Route
                path="challenge/*"
                element={
                  <>
                    <ChallengeLayout>
                      <ChallengeRoutes />
                    </ChallengeLayout>
                  </>
                }
              />
              <Route
                path="account/*"
                element={
                  <>
                    <>
                      <UserRoutes />
                    </>
                  </>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
