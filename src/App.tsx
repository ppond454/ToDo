import { useEffect, useState, createContext, ReactNode } from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import { Login, Home, Food, Transection, Breverage } from "./pages"
import { Protect } from "./components"
import Layout from "./layout"

import { auth } from "./configs/firebase"
import "./App.css"

const App = () => {
  const [isAuth, setAuth] = useState(false)

  useEffect(() => {
    isLogin()
    console.log(isAuth)
  }, [])

  const isLogin = () => {
    const pwd = localStorage.getItem("auth")
    setAuth(pwd === "25201122")
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protect isLogin={true} />}>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          element={
            <Layout>
              <Food />
            </Layout>
          }
          path="/food"
        />
        <Route
          element={
            <Layout>
              <Transection />
            </Layout>
          }
          path="/transection"
        />
        <Route
          element={
            <Layout>
              <Breverage />
            </Layout>
          }
          path="/breverage"
        />
      </Route>
      <Route path="*" element={<Navigate to="/transection" replace />} />
    </Routes>
  )
}

export default App
