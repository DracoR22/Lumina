import { useMutation } from "@apollo/client"
import { RegisterUserMutation } from "../gql/graphql"
import { REGISTER_USER } from "../graphql/mutations/register"
import { useUserStore } from "../stores/user-store"
import { useGeneralStore } from "../stores/general-store"
import { useState } from "react"
import { GraphQLErrorExtensions } from "graphql"
import Input from "./input"

const Register = () => {

  // Use mutation from GraphQL
  const [registerUser, { loading, error, data }] = useMutation<RegisterUserMutation>(REGISTER_USER)

  const setUser = useUserStore((state) => state.setUser)
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen)

  const [errors, setErrors] = useState<GraphQLErrorExtensions>({})


  const handleRegister = async () => {
    setErrors({})

    await registerUser({
      variables: {
        email: registerData.email,
        password: registerData.password,
        fullname: registerData.fullName,
        confirmPassword: registerData.confirmPassword
      }
    }).catch((_) => {
      if (error && error.graphQLErrors && error.graphQLErrors[0].extensions) {
        const validationErrors = error.graphQLErrors[0].extensions
        setErrors(validationErrors)
      }
    })

    if (data?.register.user) {
      setUser({
        id: data.register.user.id,
        email: data.register.user.email,
        fullname: data.register.user.fullname
      })

      setIsLoginOpen(false)
    }
  }

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Sign up</div>
      <div className="px-6 pb-2">
          <Input max={64} placeholder="Full Name" inputType="text" onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
          autoFocus={true} error={errors?.fullname as string}/>
      </div>
      <div className="px-6 pb-2">
           <Input  max={64} placeholder="Email" inputType="text" onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
           autoFocus={true} error={errors?.email as string}/>
      </div>
      <div className="px-6 pb-2">
           <Input  max={64} placeholder="Password" inputType="password" onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
           autoFocus={true} error={errors?.password as string}/>
      </div>
      <div className="px-6 pb-2">
           <Input max={64} placeholder="Confirm Password" inputType="password" onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
           autoFocus={true} error={errors?.confirmPassword as string}/>
      </div>
      <div className="px-6 mt-6">
        <button 
        onClick={handleRegister}
         disabled={
          !registerData.email ||
          !registerData.password ||
          !registerData.fullName ||
          !registerData.confirmPassword
        }
         className={[
            "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !registerData.email ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.confirmPassword ? "bg-gray-200" : "bg-[#F02C56]"].join(" ")}>
          Register
        </button>
      </div>
    </>
  )
}

export default Register