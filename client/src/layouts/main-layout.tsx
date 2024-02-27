import { useLocation } from "react-router-dom"
import TopNav from "../components/top-nav"
import Sidenav from "../components/side-nav"

const MainLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <div>
        <header>
            <TopNav/>
        </header>
        <div className={[
          useLocation().pathname === "/" ? "max-w-[1140px]" : "",
          "flex justify-between mx-auto w-full lg:px-2.5 px-0",
        ].join(" ")}>
           <div>
             <Sidenav/>
           </div>
           {children}
        </div>
    </div>
  )
}

export default MainLayout