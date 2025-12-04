import { mount as mountAuth } from "auth/Auth";
import React, { useRef, useEffect } from "react";

const AuthApp = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mountAuth(ref.current);
    }
  }, []);

  return <div ref={ref} />;
};

export default AuthApp;
