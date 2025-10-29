import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/model/User";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
function MessageCard({message, onMessageDelete}: MessageCardProps) {
  const handleMessageConfirm = async() => {
     await axios.delete(`/api/messages/${message._id}`)
    toast.success('Message deleted successfully')
    
    onMessageDelete(message._id)
}
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>

             <AlertDialog>
              <AlertDialogTrigger asChild>
                    <Button
                    onClick={handleMessageConfirm}
                    variant="destructive">
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
        </CardHeader>


        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
</Card>
  )
}

export default MessageCard