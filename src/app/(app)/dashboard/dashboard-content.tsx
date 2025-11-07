'use client'
import { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { motion } from "framer-motion"
import { Loader2, RotateCcw, Trash } from 'lucide-react';

interface DashboardContentProps {
    username: string;
    initialMessages: Message[]; 
    initialAcceptStatus: boolean;
}
export default function DashboardContent({
  username,
  initialMessages,
  initialAcceptStatus
}: DashboardContentProps
) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [loading, setLoading] = useState(false);
  const [userUrl, setUserUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(initialAcceptStatus);
  const handleDeleteMessage = async (messageId: string) => {
    // update local state immediately
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
    // optional: notify server about deletion
    try {
      await axios.post('/api/delete-message', { id: messageId });
      toast.success('Message deleted', {
        duration: 2000,
      });
    } catch (error: unknown) {
      toast.error('Failed to delete message', {
        duration: 2000,
      });
      console.error(error);
    }
  }
  const initialMessage = initialAcceptStatus
  console.log("initialMessage", initialMessage)

  // const form =  useForm({
  //   resolver: zodResolver(acceptMessageSchema), 
  //   defaultValues: {
  //     messagesAccept: initialAcceptStatus
      
  //   },
    
  // })
  // const messageAc = form.watch('messagesAccept')
  // console.log("messagesAccept", messageAc)
  // const { watch, setValue } = form
  // const acceptMessages = watch('messagesAccept')
  
  
const fetchMessages = useCallback(async () => {
  setLoading(true);

  try {
    const response = await axios.get("/api/get-messages");
    const messages = (response.data.messages || []) as Message[];
    setMessages(messages);
    if (messages.length > 0) {
      toast.success('Messages fetched successfully', {
        duration: 2000
      });
    } else {
      toast.success('Messages Not found', {
        duration: 2000
      });
    }
  } catch (error : unknown ) {
    toast.error(`Failed to fetch messages: ${error}`, {
      duration: 2000
    });
    console.log(`Failed to fetch messages: ${error}`);
  } finally {
    setLoading(false);
  }
}, []);

const handleSwitchChange = async (checked?: boolean) => {
  const newValue = typeof checked === 'boolean' ? checked : !isAcceptingMessages;
  try {
    await axios.post('/api/accept-messages', {
      acceptMessages: newValue,
    });

    setIsAcceptingMessages(newValue);

    if (newValue) {
      toast.success("You are now accepting messages", {
        duration: 2000,
      });
    } else {
      toast.success("You are not accepting messages", {
        duration: 2000,
      });
    }
  } catch (error: unknown) {
    toast.error('Switch changed error occured', {
      duration: 2000,
    });
    console.error(error);
  }
};

useEffect(() => {
  if (typeof window !== 'undefined') {
    setUserUrl(`${window.location.origin}/u/${username}`);
  }
}, [username]);
  
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-800
     via-black to-gray-700 p-4 sm:px-10 md:mx-0 lg:mx-0 md:p-8 "
   
    >
      <div className="max-w-7xl sm:max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-[-1rem] md:py-8">
        
        {/* Header */}
        <motion.div className="mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white "
    

          >
            Dashboard
          </h1>

         
          
        </motion.div>
        {/* Unique URL Card */}
        <Card className=" bg-transparent border-none mb-[-1rem] ">
          <CardHeader className='bg-transparent h-10 m-0 p-0'>
            <CardTitle
            className='bg-transparent mb-[-0.5rem] p-0 text-white text-xl sm:text-2xl md:text-3xl lg:text-3xl  font-semibold'
            >Your Anonymous URL</CardTitle>
            <CardDescription
            className='text-gray-300 text-[18px] mb-4'
            >
              Share this link for people to send you anonymous messages.
            </CardDescription>
          </CardHeader>
          <CardContent
          className='m-0  p-0'
          >
            <div className="flex items-center space-x-2 bg-transparent underline underline-offset-4 mt-4 rounded-md">
              <input
                type="text"
                value={userUrl}
                readOnly
                className="flex-grow bg-transparent outline-none text-[18px] stre  text-white font-serif font-stretch-semi-expanded"
              />

              <motion.div
              animate={copied ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              >
                <Button
                className="text-sm mb-1 decoration-none cursor-pointer bg-transparent text-white border border-amber-100 hover:bg-amber-100 hover:text-black"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    userUrl
                  )
                  setCopied(true)
                  toast.success('URL copied!', {
                    duration: 2000
                  })
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              </motion.div>
            </div>
            <Separator className="mt-1 mb-5" />
          <CardContent
          className='h-6  m-0 p-0 '
          >
            
              <form>
                <div>
                  <div className="flex flex-row items-center justify-between rounded-lg  bg-transparent">
                    <div className="text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl">
                      Are You Accepting New Messages :
                    </div>
                    <Switch
                      className="mr-2 cursor-pointer border-2 ring-1 ring-white/70 transition-all duration-300 data-[state=checked]:bg-green-500 data-[state=checked]:ring-green-400 "
                      checked={isAcceptingMessages}
                      onCheckedChange={handleSwitchChange}
                      aria-readOnly
                    />
                  </div>
                </div>
              </form>
            
          </CardContent>
            </CardContent>
        </Card>
        
        <Separator className="my-6" />

        {/* Messages List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Messages</h2>
            <Button
              className="flex items-center gap-2 group cursor-pointer"
              variant="outline"
              onClick={() => fetchMessages()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className='flex gap-1 items-center '>
                  <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition duration-300" />
                  {'Refresh'}
                </div>
              )}
            </Button>
          </div>

          {/* Message List Grid */}
          {messages.length > 0 ? (
            <motion.div 
            className="grid grid-cols-1 md:grid-cols-2
             lg:grid-cols-3 gap-4"
             initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
                        
             >
              {messages.map((message, index) => (
                <motion.div
                key={message._id}
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                >

                <Card
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10"

                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                  transitionProperty: 'opacity, transform'
                 }}
                key={message._id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-3">{message.content}</CardTitle>
                    <CardDescription>
                      {/* You can format this date */}
                      Received at: {String(message.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="transition-all hover:scale-105"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </CardContent>
                </Card>

                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" /* mail icon */ />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Share your anonymous URL and start receiving messages from friends!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>

  
  
  
    
  )
}

