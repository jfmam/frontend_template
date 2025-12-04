import React, { Suspense, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// Module Federation remotes (webpack.config.js의 remotes와 이름이一致해야 함)
const Auth = React.lazy(() => import("./components/AuthApp"));
const DashboardApp = React.lazy(() => import("./components/DashboardApp"));

const App = () => (
  <div>
    <h1>Container</h1>
    <Suspense fallback={<div>Loading Auth...</div>}>
      <Auth />
    </Suspense>
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardApp />
    </Suspense>
  </div>
);

const root = createRoot(document.getElementById("container"));
root.render(<App />);
