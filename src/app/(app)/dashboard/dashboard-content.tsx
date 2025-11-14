'use client'
import { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { motion } from "framer-motion"
import { Loader2, RotateCcw } from 'lucide-react';

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
    const prev = [...messages];
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
    try {
      const response = await axios.delete('/api/delete-message', {
        data: { id: messageId }
      });
      if (response.data.success) {
        toast.success('Message deleted', {
        duration: 2000,
      })
      
    }
      
    } catch (error: any) {
      if(axios.isAxiosError(error) && error.response){
        console.error('Error response:', error.response.data);
      }
      
      toast.error('Failed to delete message', {
        duration: 2000,
      });
      console.error(error);
      setMessages(prev);
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

    <div className="min-h-screen  bg-gradient-to-br from-gray-800
     via-black to-gray-700 p-4 sm:px-10 md:mx-0 lg:mx-0 md:p-8 "
   
    >
      <div className="max-w-7xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-[-1rem] md:py-8">
        
        {/* Header */}
        <motion.div className="mt-8 flex items-center justify-between"
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
                    <div className='flex justify-center items-center gap-0'>
                    <Switch
                      className="mr-2 cursor-pointer border-2 ring-1 ring-white/70 transition-all duration-300 data-[state=checked]:bg-green-500 data-[state=checked]:ring-green-400 "
                      checked={isAcceptingMessages}
                      onCheckedChange={handleSwitchChange}
                    />
                    <p className='text-white text-md'>{isAcceptingMessages ? 'ON' : 'OFF'}</p>

                    </div>
                  </div>
                </div>
              </form>
            
          </CardContent>
            </CardContent>
        </Card>
        
        <Separator className="my-6" />

        {/* Messages List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-semibold">Your Messages :</h2>
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
             lg:grid-cols-3 gap-6"
             initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
                        
             >
              {messages.map((message, index) => (
                <motion.div
                className='hover:cursor-pointer'
                key={message._id}
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                >

                <Card
                className=" flex flex-row items-center gap-4 relative justify-between transform transition-all duration-300 hover:scale-101 hover:shadow-xl hover:shadow-white/10"

                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                  transitionProperty: 'opacity, transform'
                 }}
                key={message._id}>
                  <CardHeader className=" flex flex-col gap-4 justify-between items-start">
                    <CardTitle className="w-[200px]">{message.content}</CardTitle>
                    <CardDescription>
                      {/* You can format this date */}
                      Received at: {String(message.createdAt)}
                    </CardDescription>
                   
                  </CardHeader>
                  <Tooltip>
                    <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="transition-all hover:scale-105 absolute top-2 right-2 mx-3 py-2 cursor-pointer"
                            onClick={() => handleDeleteMessage(message._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                          </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                    sideOffset={5}
                    className='bg-red-200 h-8'
                    >
                      <p className='text-black text-[14px]'>Permanently Delete</p>
      </TooltipContent>
                  </Tooltip>

               
                 
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

