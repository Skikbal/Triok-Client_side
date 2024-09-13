import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoutes = () => {
  const isAuthenticated = useSelector((state) => state.token);

  return isAuthenticated !== null ? <Outlet /> : <Navigate to="/login" replace />;
};
