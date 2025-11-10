'use client'

import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function Page() {
    const form = useForm({
        defaultValues: {
          content: '',
        },
      })
        
      const onSubmit = async (data: any) => {
        const content = data.content
        const usernameFromPath = window.location.pathname.split('/u/')[1]
        const username = usernameFromPath
        
        try {

            const response = await axios.post('/api/send-message', {
              username: username,
              content: content
            })
            if (response.status === 200 ) {
                toast.success('Message submitted successfully')
            }
            if (response.status !== 200 ) {
                toast.error('Failed to submit message', { description: response.data.message })
            }
            form.reset()
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                const serverMsg = err.response.data?.message || `Request failed (${err.response.status})`;
                toast.error(serverMsg);
                return;
            }
            toast.error('Failed to submit message', { description: err.message })
            console.error("Error submitting message:", err)
        }
       
      }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden bg-black">
        <BackgroundRippleEffect />
        <div >
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            

             <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                    className="text-white text-sm bg-black w-xl h-[100px] m-0 p-0 border border-amber-10"
                    placeholder="Enter Your message " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" 
            className="w-full mt-4 border
            cursor-pointer hover:bg-amber-100 hover:text-black border-amber-100">
                Submit Message
            </Button>
          </form>
        </Form>
        </div>
         
    </div>
  )
}

export default Page