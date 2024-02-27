import { useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/user-store"
import { useGeneralStore } from "../stores/general-store"
import { useEffect } from "react"


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

   const user = useUserStore((state) => state)
   const navigate = useNavigate()
   const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen)

   useEffect(() => {
     if (!user.id) {
        navigate('/')
        setLoginIsOpen(true)
     }
   }, [user.id, navigate, setLoginIsOpen])

   if (!user.id) {
    return (
        <div>
          No Access
        </div>
    )
   }

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute