import { useMutation } from "@apollo/client"
import { LoginUserMutation } from "../gql/graphql"
import { useUserStore } from "../stores/user-store"
import { useGeneralStore } from "../stores/general-store"
import { useState } from "react"
import { GraphQLErrorExtensions } from "graphql"
import Input from "./input"
import { LOGIN_USER } from "../graphql/mutations/login"

const Login = () => {

  // Use mutation from GraphQL
  const [loginUser, { loading, error, data }] = useMutation<LoginUserMutation>(LOGIN_USER)

  const setUser = useUserStore((state) => state.setUser)
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen)

  const [errors, setErrors] = useState<GraphQLErrorExtensions>({})
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [invalidCredentials, setInvalidCredentials] = useState('')

  const handleLogin = async () => {
    setErrors({})

   try {
    const response = await loginUser({
      variables: {
        email: loginData.email,
        password: loginData.password,
      }
    })

     response && response.data && setUser(response.data.login.user)
     setIsLoginOpen(false)
    } catch (_) {
      if (error && error.graphQLErrors[0].extensions?.invalidCredentials) {
        setInvalidCredentials(error.graphQLErrors[0].extensions?.invalidCredentials as string)
      } else {
       if (error) setErrors(error.graphQLErrors[0].extensions)
      }
    }
    
  }

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Login</div>
      <div className="px-6 pb-2">
           <Input  max={64} placeholder="Email" inputType="text" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
           autoFocus={true} error={errors?.email as string}/>
      </div>
      <div className="px-6 pb-2">
           <Input  max={64} placeholder="Password" inputType="password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
           autoFocus={true} error={errors?.password as string}/>
      </div>

      <div className="px-6">
      <span className="text-red-500 text-[14px] font-semibold">
        {invalidCredentials}
      </span>

        <button 
        onClick={handleLogin}
         disabled={
          !loginData.email ||
          !loginData.password
        }
         className={[
            "w-full text-[17px] mt-6 font-semibold text-white bg-[#F02C56] py-3 rounded-sm",
            !loginData.email ||
            !loginData.password].join(" ")}>
          login
        </button>
      </div>
    </>
  )
}

export default Login