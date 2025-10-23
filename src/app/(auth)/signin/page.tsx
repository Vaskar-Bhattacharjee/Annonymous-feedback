'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { Axios } from "axios"
import { Link } from "next/link"
import { useState, useEffect } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { toast } from "sonner" 
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { set } from "mongoose"
function Page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [loader, setLoader] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const debouncedUsername = useDebounce(username, 500)
  const router = useRouter()

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as any
          if (axiosError.response) {
            setUsernameMessage(axiosError.response.data.message)
          } else {
            setUsernameMessage('Error checking username')
          }
        } finally {
          setIsCheckingUsername(false)}
      }
      
    }
    checkUsername()
  }, [debouncedUsername]);
  const onSubmit = async(data: z.infer <typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/auth/signup', data)
      if (response.data.success) {
        toast.success('Account created successfully')
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } else {
        toast.error(response.data.message || 'Error creating account')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred during signup')
      setIsSubmitting(false)
    }
  }
  
  return (
    <div>
      
    </div>
  )
}

export default page