'use client'
import { useCallback, useEffect, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios from 'axios';
import { AlertTriangle, Loader2, LogOut, Trash, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
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
        toast.success('Messages fetched successfully')
      }
      if (messages.length == 0) {
        toast.success('Messages Not found')
      }
      // if (refresh) {
      //   toast.success('Messages refreshed successfully')
      // }
    } catch (error : any) {
      toast.error('Failed to fetch messages')
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
      toast.success("succesfully changed")
    } catch (error : unknown ) {
      toast.error(`Switch changed error occured : ${error}`)
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
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-white ">
            Dashboard
          </h1>
            <DropdownMenu>
              {/* Trigger button using the username */}
              <DropdownMenuTrigger asChild> 
                <Button variant="link" className="text-lg font-semibold text-white undrerline
                 underline-offset-4 cursor-pointer
                 px-4 py-2 rounded-lg">
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
         
          
        </div>
        {/* Unique URL Card */}
        <Card className="mb-6 bg-transparent border-0 hover:border-1 duration-100 ease-in-out ">
          <CardHeader className='bg-transparent h-10 '>
            <CardTitle
            className='bg-transparent text-white text-2xl font-semibold'
            >Your Anonymous URL</CardTitle>
            <CardDescription
            className='text-gray-300 text-md'
            >
              Share this link for people to send you anonymous messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 bg-transparent underline underline-offset-4 p-3 rounded-md">
              <input
                type="text"
                value={userUrl}
                readOnly
                className="flex-grow bg-transparent outline-none text-md text-gray-200"
              />
              <Button
                className="text-sm decoration-none cursor-pointer bg-transparent text-white border border-amber-100 hover:bg-amber-100 hover:text-black"
                variant="default"
                size="lg"
                onClick={() => {
                  navigator.clipboard.writeText(
                    userUrl
                  )
                  toast.success('URL copied!')
                }}
              >
                Copy
              </Button>
              
            </div>
            <div className='w-full h-0.5 bg-gray-700'></div>
          </CardContent>
        </Card>

        {/* Control Panel Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form>
                <FormField
                  name="acceptMessages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Accepting Messages
                        </FormLabel>
                        <p className="text-sm text-gray-500">
                          Toggle this to stop receiving new messages.
                        </p>
                      </div>
                      <FormControl>
                        <Switch 
                          className="mr-2 cursor-pointer"

                          checked={field.value}
                          onCheckedChange={handleSwitchChange}
                          
                          aria-readonly
                        />
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
              className='shadow cursor-pointer '
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {/* Message List Grid */}
          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {messages.map((message) => (
                <Card key={message._id}>
                  <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                    <CardDescription>
                      {/* You can format this date */}
                      Received at: {String(message.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No anonymous messages yet.</p>
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
            <Button className='cursor-pointer' variant="outline" disabled={isDeleting}>Cancel</Button>
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

