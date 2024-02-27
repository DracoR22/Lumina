import AuthModal from "./components/auth-modal"
import { useGeneralStore } from "./stores/general-store"


const App = () => {

  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen)

  return (
    <div>
      {isLoginOpen && <AuthModal/>}
    </div>
  )
}

export default App