'use client'
 import { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';




function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchWatching, setIsSwitchWatching] = useState(false);
  
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }
  const {data: session} = useSession()
  const form =  useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {register, watch, setValue } = form
  const acceptMessages = watch('messagesAccept')
  
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchWatching(true);
    try {
      const response = await axios.get('/api/accept-messages')
      setValue('messagesAccept', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>
      if (axiosError.response) {
        toast.error(axiosError.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }finally {
      setIsSwitchWatching(false)
    }

  }, [setValue]);


  const fetchMessages = useCallback(async (refresh : boolean) => {
    setLoading(true);
    setIsSwitchWatching(false);
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages || []);
      toast.success('Messages fetched successfully')
      if (refresh) {
        toast.success('Messages refreshed successfully')
      }
    } catch (error : any) {
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false);
     setIsSwitchWatching(false);
    }
    }, [setLoading, setMessages]
  )
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages(true)
    fetchAcceptMessages();
  }, [session, setValue, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessages })
      setValue("messagesAccept", !acceptMessages) 
      toast.success("succesfully changed")
    } catch (error : unknown ) {
      toast.error(`Switch changed error occured : ${error}`)
      console.log(error)
    }
  }
  return (
    <div className='w-full flex flex-col'>
      <h1 className='text-black text-2xl font-mono'>Dashboard</h1>
      <p className='text-black font-mono mt-8 text-xl '>Your Annonymous account controller panel</p>


    </div>
  )
}

export default Page