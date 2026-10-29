
import React from "react";
import { Navigate } from "react-router-dom";

function IndexRedirect() {
  const token = localStorage.getItem("token");


  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default IndexRedirect;