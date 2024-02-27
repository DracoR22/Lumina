import { useMutation } from "@apollo/client"
import { useEffect, useRef, useState } from "react"
import { CREATE_POST } from "../graphql/mutations/create-post"

const Upload = () => {

  const fileRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileDisplay(URL.createObjectURL(e.target.files[0]))
      setFileData(e.target.files[0])
    }
  }

  const [show, setShow] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [fileDisplay, setFileDisplay] = useState<string | undefined>(undefined)
  const [errorType, setErrorType] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [fileData, setFileData] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onError: (err) => {
      console.log(err)
      setErrors(err.graphQLErrors[0].extensions?.errors)
    },
    variables: {
      text: caption,
      video: fileData,
    },
  })

  const handleCreatePost = async () => {
    try {
      console.log("FILDATA!", fileData)
      setIsUploading(true)
      await createPost()
      setIsUploading(false)
      setShow(true)
      clearVideo()
    } catch (err) {
      console.log(err)
    }
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    setErrorType(null)
    setFile(e.dataTransfer.files[0])
    // setFileData(e.dataTransfer.files[0])

    const extension = e.dataTransfer.files[0].name.split(".").pop()
    if (extension !== "mp4") {
      setErrorType("file")
      return
    }

    setFileDisplay(URL.createObjectURL(e.dataTransfer.files[0]))
    console.log(fileDisplay)
  }

  const discard = () => {
    setFile(null)
    setFileDisplay(undefined)
    setCaption("")
  }

  const clearVideo = () => {
    setFile(null)
    setFileDisplay(undefined)
  }

  useEffect(() => {
    console.log(caption.length)
    if (caption.length === 150) {
      setErrorType("caption")
      return
    }

    setErrorType(null)
    console.log("caption", errorType)
  }, [errorType, caption])

  return (
    <div>Upload</div>
  )
}

export default Upload