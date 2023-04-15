import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

export default function Login() {
  const [pwd, setPwd] = useState("")

  const navigate = useNavigate()

  const validatePassword = (p: string) => {
    return p === localStorage.getItem("auth")
  }

  const handleSignin = () => {
    validatePassword(pwd)
    localStorage.setItem("auth", pwd)
    location.reload()
  }

  return <div></div>
}
