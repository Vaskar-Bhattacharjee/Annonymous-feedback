'use client'
import { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios from 'axios';
import { AlertTriangle, Loader2, LogOut, RotateCcw, Trash, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const handleDeleteMessage = async (messageId: string) => {
   messages.filter((message) => message._id !== messageId);
  } 


  // const handleDeleteAccount = async () => {
  //   setIsDeleting(true);
  //   try {
  //     await axios.delete('/api/delete-account');
  //     toast.success("Account deleted successfully. Logging out...");
  //     setTimeout(() => {
  //       signOut({ callbackUrl: '/' });
  //     }, 2000);
  //   } catch (error) {
  //     toast.error("Failed to delete account. Please try again.");
  //     setIsDeleting(false);
  //   }
  // };
  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (actionToConfirm === 'logout') {
     signOut();

    } else if (actionToConfirm === 'delete') {
      
      //await handleDeleteAccount(); 
    }
    setActionToConfirm(null);
  };
  const isDelete = actionToConfirm === 'delete';
  const dialogTitle = isDelete ? (
    <>
      <AlertTriangle className="text-red-600 mr-2" />
      Are you absolutely sure?
    </>
  ) : (
    "Confirm Logout"
  );
 const dialogDescription = isDelete ? (
    "This action cannot be undone. This will permanently delete your account and remove all your messages from our servers."
  ) : (
    "You will be immediately logged out of your session. Do you want to continue?"
  );

  const actionText = isDelete ? (isDeleting ? 'Deleting...' : 'Yes, delete my account') : 'Yes, Logout';
  const actionVariant = isDelete ? 'destructive' : 'default'; 


 const form =  useForm({
    resolver: zodResolver(acceptMessageSchema), 
    defaultValues: {
      messagesAccept: initialAcceptStatus
    }
  })
  const { watch, setValue } = form
  const acceptMessages = watch('messagesAccept')
  
  
  const fetchMessages = useCallback(async (refresh : boolean) => {
    setLoading(true);

    try {
      const response = await axios.get("/api/get-messages");
      const messages = (response.data.messages || []) as Message[];
      setMessages(messages);
      if (messages.length > 0) {
        toast.success('Messages fetched successfully', {
          duration: 2000
        })
      }
      if (messages.length == 0) {
        toast.success('Messages Not found', {
          duration: 2000
        })
      }
      // if (refresh) {
      //   toast.success('Messages refreshed successfully')
      // }
    } catch (error : any) {
      toast.error('Failed to fetch messages', {
          duration: 2000
        })
    } finally {
      setLoading(false);
    }
    }, []
  )

  const handleSwitchChange = async () => {
    try {
      await axios.post('/api/accept-messages', {
      acceptMessages: !acceptMessages })

      setValue("messagesAccept", !acceptMessages) 
      if (acceptMessages === true) {
        toast.success("You are now accepting messages", {
          duration: 2000
        })
      } else if(acceptMessages === false){
        toast.success("You are not accepting messages", {
        duration: 3000
      })
      }
     
    } catch (error : unknown ) {
      toast.error(`Switch changed error occured : ${error}`, {
          duration: 2000
        })
      console.log(`Switch changed error occured : ${error}`)
    }
  }

  useEffect(() => {
  if (typeof window !== 'undefined') {
    setUserUrl(`${window.location.origin}/u/${username}`);
  }
}, [username]);
  
  return (
    <AlertDialog>
    <div className="min-h-screen bg-gradient-to-br from-gray-900
     via-black to-gray-900 p-4 sm:px-10 md:mx-0 lg:mx-0 md:p-8"
   
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div className="mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white "
    

          >
            Dashboard
          </h1>
            <DropdownMenu>
              {/* Trigger button using the username */}
              <DropdownMenuTrigger asChild> 
                <Button variant="link" className="text-lg font-semibold text-white undrerline
                 underline-offset-4 cursor-pointer
                 px-4 py-4 rounded-lg">
                  {username}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* LOGOUT BUTTON: Now uses AlertDialogTrigger and sets state */}
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                        onClick={() => setActionToConfirm('logout')} 
                        className="cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                
                {/* DELETE ACCOUNT BUTTON: Uses AlertDialogTrigger and sets state */}
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                      onClick={() => setActionToConfirm('delete')}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    <span>Delete Account</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                
              </DropdownMenuContent>
            </DropdownMenu>
         
          
        </motion.div>
        {/* Unique URL Card */}
        <Card className=" bg-transparent border-none mb-[-1rem] ">
          <CardHeader className='bg-transparent h-10 m-0 p-0'>
            <CardTitle
            className='bg-transparent mb-[-0.5rem] p-0 text-white text-2xl font-semibold'
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
            
          </CardContent>
          <Separator className="my-0" />
        </Card>
        

        {/* Control Panel Card */}
        <Card className="mb-6 bg-transparent border-0 h-5">
         
          <CardContent
          className='h-6  m-0 p-0 '
          >
            <Form {...form}>
              <form
              
              >
                <FormField
                
                  name="acceptMessages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg  bg-transparent">
                     
                        <FormLabel className="text-white font-semibold text-2xl">
                         Are You Accepting New Messages :
                        </FormLabel>
                       
                      
                      <FormControl >
                        <motion.div  whileTap={{ scale: 0.95 }} >

                          <Switch 
                          className="mr-2 cursor-pointer border-2 ring-1 ring-white/70 transition-all duration-300 data-[state=checked]:bg-green-500 data-[state=checked]:ring-green-400 "

                          checked={field.value}
                          onCheckedChange={handleSwitchChange}
                          
                          aria-readonly
                        />
                        </motion.div>
                        
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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
              onClick={() => fetchMessages(true)}
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

    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            {dialogTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel Button */}
          <AlertDialogCancel asChild>
            <Button className='cursor-pointer outline-0' variant="outline" disabled={isDeleting}>Cancel</Button>
          </AlertDialogCancel>
          
          {/* Action Button: Handles the dynamic logic */}
          <AlertDialogAction 
            asChild
            onClick={handleAction} // Executes either logout or delete
            disabled={isDeleting}
          >
            <Button
              // Use conditional variants for styling (destructive for delete)
              className="cursor-pointer"
              variant={actionVariant as 'destructive' | 'default'} 
              disabled={isDeleting}
            >
              {/* Show spinner only if deleting and isDeleting is true */}
              {isDelete && isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {actionText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  
    
  )
}

