import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createMemoryHistory, createBrowserHistory } from 'react-router-dom';

const mount = (el, { defaultHistory, initialPath }) => {
  const history = defaultHistory || createMemoryHistory();
  const root = createRoot(el);
  root.render(<App />);
};

if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("auth");
  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory(), initialPath: window.location.pathname });
  }
}

export { mount };
