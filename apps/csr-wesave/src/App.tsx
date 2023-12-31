import React, { Suspense, lazy, useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import { Header } from './components/section';
import { QueryClient, QueryClientProvider } from 'react-query';

// import ForgotPassword from './pages/forgot-password';
// import SignIn from './pages/login';
// import ResetPassword from './pages/reset-password';
// import Salary from './pages/salary';
// import SignUp from './pages/signup';
// import Timer from './pages/timer';
// import MyPage from './pages/mypage';
// import TodayChallenge from './pages/challenge/today-challenge';
// import AchievementStatus from './pages/challenge/achievement-status';
// import MyAchievement from './pages/challenge/my-achievement';
// import Register from './pages/challenge/register';
// import Home from './pages';

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="login" element={<SignIn />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="salary" element={<Salary />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="timer" element={<Timer />} />
      <Route path="mypage" element={<MyPage />} />
      <Route path="challenge/today-challenge" element={<TodayChallenge />} />
      <Route path="challenge/achievement-status" element={<AchievementStatus />} />
      <Route path="challenge/my-achievement" element={<MyAchievement />} />
      <Route path="challenge/register" element={<Register />} />
    </Route>,
  ),
);

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
    <div>
      <Header />
      <QueryClientProvider client={queryClient}>
        <main id="main">
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </main>
      </QueryClientProvider>
    </div>
  );
}

export default App;
