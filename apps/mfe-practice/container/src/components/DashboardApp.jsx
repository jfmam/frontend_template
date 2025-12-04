import { mount as mountDashboard } from "dashboard/Dashboard";
import React, { useRef, useEffect } from "react";

const DashboardApp = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mountDashboard(ref.current);
    }
  }, []);

  return <div ref={ref} />;
};

export default DashboardApp;
