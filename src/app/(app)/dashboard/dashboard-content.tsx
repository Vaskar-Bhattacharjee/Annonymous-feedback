'use client'
import { useCallback, useState } from 'react'
import { Message } from "@/model/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios from 'axios';
import { Loader2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';


export interface ClientSafeMessage {
    _id: string; 
    content: string;
    createdAt: string;
    // Add any other message fields (must be strings, numbers, or booleans)
}

interface DashboardContentProps {
    username: string;
    // CRITICAL: Use the safe type for the messages array
    initialMessages: ClientSafeMessage[]; 
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
  
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }
  

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
      setMessages(response.data.messages || []);
      toast.success('Messages fetched successfully')
      if (refresh) {
        toast.success('Messages refreshed successfully')
      }
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
      console.log(error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="font-semibold text-blue-600">{username}</span>
          </p>
        </div>
        {/* Unique URL Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Anonymous URL</CardTitle>
            <CardDescription>
              Share this link for people to send you anonymous messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
              <input
                type="text"
                value={`${window.location.origin}/u/${username}`}
                readOnly
                className="flex-grow bg-transparent outline-none text-gray-700"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/u/${username}`
                  )
                  toast.success('URL copied!')
                }}
              >
                Copy
              </Button>
            </div>
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
  
    
  )
}

