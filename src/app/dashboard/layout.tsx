import React, { type ReactNode } from "react";

interface dashboardProps {
  children: ReactNode;
}

const Dashboard = ({ children }: dashboardProps) => {
  return (
    <div>
      <h1>SIDE BAR</h1>
      <h1>{children}</h1>
    </div>
  );
};

export default Dashboard;
