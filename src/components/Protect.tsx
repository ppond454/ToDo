import React, { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function Protect({ isLogin }: { isLogin: boolean }) {
  if (!isLogin) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
