"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
//import { Loader2 } from "lucide-react"

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema >>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
      
    })
    const onSubmit = async (values: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/auth/verifyEmail", {
               username: param.username,
               code: values.code 
               
            })
            console.log(response.data)
            toast.promise(response.data, {
                loading: "Verifying...",
                success: "Account verified successfully",
                error: "Failed to verify account"
            })
            router.push("/signin")

        } catch (error) {
            console.log(error)
            toast.error("Failed to verify account")
        } finally {
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

    <div className="max-w-md z-10 mx-auto mt-10 
    bg-black p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
    <h1 className="text-3xl font-bold
      mx-auto tracking-wider

      mb-6 text-white">Verify Your Account</h1>
    <p className="text-lg mx-auto text-center mb-2 text-white ">Enter the verification code
    sent</p>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
              
                <FormControl>
                  <Input
                    placeholder="Enter verification code"
                    {...field}
                    className="text-white bg-black
                    outline-none border border-white p-2 w-full"
                  />
                </FormControl>
              </FormItem>
            )}   
          />
          <Button
            type="submit"
            className="w-full cursor-pointer border border-amber-100
             hover:bg-amber-100 hover:text-black p-2"
          >
            {isSubmitting ? 
            <Loader2 className="animate-spin">

            </Loader2> : " verify "  }
          </Button>

        </form>
      </Form>  
          
    
    
    </div>





        </div>
    )

}
export default VerifyAccount