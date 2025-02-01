import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken"); // Example logic

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoutes;
