/*
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import AppSidebar from "@/components/AppSidebar";

const AppLayout: React.FC = () => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
*/
