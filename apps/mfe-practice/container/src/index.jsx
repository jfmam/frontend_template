import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Module Federation remotes (webpack.config.js의 remotes와 이름이一致해야 함)
const Auth = React.lazy(() => import('./components/AuthApp'));
const DashboardApp = React.lazy(() => import('./components/DashboardApp'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<DashboardApp />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const root = createRoot(document.getElementById('container'));
root.render(<App />);
