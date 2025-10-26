'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from "axios"
//import Link from "next/link"
import { useState, useEffect } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { toast } from "sonner" 
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"



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
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{message: string}>
            if (axiosError.response) {
              setUsernameMessage(axiosError.response.data.message)
            } else {
              setUsernameMessage('Error checking username')
            }   
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
      const response = await axios.post('/api/sign-up', data)
      if (response.data.success) {
        toast.success('Account created successfully')
        //router.replace(`/verify/${username}`)
        console.log('Account created successfully' )
        setIsSubmitting(false)
      } else {
        toast.error(response.data || 'Error creating account')
        setIsSubmitting(false)
        console.log(response.data)
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred during signup')
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className=" relative flex justify-center items-center
    
    h-[100vh]">
      
        <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          rgba(0,0,0,0.05) 0 1px,
          transparent 1px 20px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(0,0,0,0.05) 0 1px,
          transparent 1px 20px
        )
      `,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />


        

    <div className="max-w-md mx-auto mt-10 
    bg-black p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold
      mx-auto tracking-wider font-mono

      mb-6 text-white">Welcome to mistery message Service </h1>

      <h1 className="text-2xl font-bold mb-6 text-white">Sign Up</h1>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input 
                    
                    placeholder="Enter username" {...field}
                    className="text-white text-sm"
                    onChange={(e)=>{
                      field.onChange(e)
                      setLoader(true)
                      setUsername(e.target.value )
                    }}
                   
                    />
                  </FormControl>
                    
                     
                      
                    
                   
                    {username && (

                      <div className="flex items-center gap-1">
                      {isCheckingUsername && (
                        <Loader2 className="animate-spin h-4 w-4 text-yellow-500" />
                      )}

                      <p className={`mt-1 text-sm ${isCheckingUsername ? 'text-yellow-500' : usernameMessage === 'Username is available' ?  'text-green-500' : 'text-red-500'}`}>
                        {isCheckingUsername ? 
                        
                        
                        'Checking username...' : usernameMessage}
                      </p>

                      </div>
                    )}
                      
                    
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                    className="text-white text-sm bg-black"
                    placeholder="Enter email " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input 
                    type="password"
                    className="text-sm text-white"
                    placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting }
            className="w-full mt-4 border
            cursor-pointer hover:bg-amber-100 hover:text-black border-amber-100">
              {isSubmitting ? 
              <Loader2 className="animate-spin mr-2 h-4 w-4 cursor-not-allowed" />
              : 'Sign Up'}
            </Button>
          </form>
        </Form>
      

      
    </div>

      </div>

   
  )
}

export default Page