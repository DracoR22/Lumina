import { useEffect } from "react"

interface Props {
    placeholder: string
    inputType: string
    max: number
    error: string
    autoFocus: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
}

const Input = ({ placeholder, inputType, autoFocus, error, max, onChange, value }: Props) => {

   useEffect(() => {
     if (autoFocus) {
        const input = document.getElementById(`input-${placeholder}`)
        input?.focus()
     }
   }, [autoFocus, placeholder])

  return (
    <div>
       <input value={value} id={`input-${placeholder}`} placeholder={placeholder} type={inputType}
       autoComplete="off" maxLength={max} onChange={onChange}
       className="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"/>
       {error && (
        <span className="text-red-500 text-[14px] font-semibold">{error}</span>
      )}
    </div>
  )
}

export default Input