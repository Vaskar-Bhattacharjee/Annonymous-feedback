'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner" 
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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
import { logInSchema } from "@/schemas/logInSchema"



function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  //zod implementation
  const form = useForm({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      
      identifier: '',
      password: ''
    }
  })
  
  const onSubmit = async(data: z.infer <typeof logInSchema>) => {
   try {
     setIsSubmitting(true)
     const res = await signIn('credentials', {
         identifier: data.identifier,
         password: data.password,
         redirect: false
     })
 
     if (res?.error) {
         toast.error('Login failed',{description: res.error})
     } else if (res?.url) {
         toast.success('Login successful',{
             description: `Welcome back `,
             
         })
         router.replace('/dashboard')
     }
   } catch (error) {
     console.error('Login error:', error)
     toast.error('An error occurred during login')
   }
   finally {
     setIsSubmitting(false)
   }
  }
  
  return (
    <div className=" relative flex justify-center items-center
    
    h-[100vh] ">
      
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


        

    <div className="max-w-md  mx-auto mt-10 w-[200rem]
    bg-black p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
      
      <h1 className="text-2xl font-bold mb-6 text-white">Sign In</h1>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            

             <FormField
              control={form.control}
              name="identifier"
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
              <div className="flex">
                <Loader2 className="animate-spin mr-2 h-4 w-4
              text-white cursor-not-allowed">
                
              </Loader2>
                <span className="text-white">Signing In...</span>
              </div>

              
              
              : 'Sign In'}
            </Button>
          </form>
        </Form>
      

      
    </div>

      </div>

   
  )
}

export default Page