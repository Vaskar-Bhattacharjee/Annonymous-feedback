'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { BackgroundBeams } from "@/components/ui/background-beams";


function Page() {
    const [isLoading, setIsLoading] = useState(false) // For loading state
    const form = useForm({
        defaultValues: {
          content: '',
        },
      })
        
      const onSubmit = async (data: { content: string }) => {
        const content = data.content
        const usernameFromPath = window.location.pathname.split('/u/')[1]
        const username = usernameFromPath
        
        setIsLoading(true) // Start loading
        try {
            const response = await axios.post('/api/send-message', {
              username: username,
              content: content
            })

            if (response.status === 200 ) {
                toast.success('Message submitted successfully!')
                form.reset() // Reset form on success
            } else {
                toast.error('Failed to submit message', { description: response.data?.message || 'Unknown error' })
            }
        } catch (err: unknown) {
            
            if (axios.isAxiosError(err) && err.response) {
                const serverMsg = err.response.data?.message || `Request failed (${err.response.status})`;
                toast.error('Submission Error', { description: serverMsg });
                return;
            }
            if (err instanceof Error) {
                toast.error('Failed to submit message', { description: err.message });
            } else {
                toast.error('Failed to submit message', { description: 'An unknown error occurred' });
            }
            console.error("Error submitting message:", err)
        } finally {
            setIsLoading(false) // Stop loading in all cases
        }
       
      }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden bg-black text-white">
    
        <BackgroundBeams />

        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative z-10 w-[700px]  p-6 sm:p-8 bg-black/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-xl"
        >
            {/* Header */}
            <div className="text-center  mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-300 mb-2">
                    Send a Message Anonymously
                </h1>
                <p className="text-[16px] text-gray-400">
                    Your message will be sent anonymously.
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="content"
                  control={form.control}
                  rules={{ required: "Message cannot be empty" }} // Added validation
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                            placeholder="Write your secret message here..."
                            className="text-white text-2xl  bg-gray-900/60 border-2 border-gray-700/90 rounded-lg min-h-[120px] 
                                       placeholder:text-gray-500  outline-none focus:outline-none                                       transition-all duration-300 ease-in-out" 
                            {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button with micro-interaction */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 px-6 text-base font-semibold 
                                   bg-gradient-to-r from-green-400 to-green-600 cursor-pointer text-black 
                                   rounded-lg shadow-lg
                                   hover:from-amber-500 
                                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black
                                   transition-all duration-300 ease-in-out
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-5 w-5" />
                        )}
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                </motion.div>
              </form>
            </Form>
        </motion.div>
    </div>
  )
}

export default Page