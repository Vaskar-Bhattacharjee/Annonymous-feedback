'use client'

import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Form, useForm } from 'react-hook-form'

function page() {
    const form = useForm({
        defaultValues: {
          message: '',
        },
      })

      const onSubmit = (data: any) => {
        console.log(data)
        // Handle form submission
      }

  return (
    <div >
        <BackgroundRippleEffect />
        <div>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            

             <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                    className="text-white text-sm bg-black"
                    placeholder="Enter Your message " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        </div>
         
    </div>
  )
}

export default page