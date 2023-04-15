import React from "react"
import { Navbar } from "../components"

interface Props {
  children?: React.ReactNode
}

const index = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default index
