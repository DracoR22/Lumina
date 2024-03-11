import React from "react"

import { useLocation } from "react-router-dom"
import Sidenav from "../components/side-nav"
import TopNav from "../components/top-nav"

function UploadLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <TopNav/>
      </header>
      <div
        className={[
          useLocation().pathname === "/" ? "max-w-[1140px]" : "",
          "flex justify-between mx-auto w-full lg:px-2.5 px-0",
        ].join(" ")}>
        <div>
          <Sidenav/>
        </div>
        {children}
      </div>
    </>
  )
}

export default UploadLayout