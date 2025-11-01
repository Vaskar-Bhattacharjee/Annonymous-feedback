
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth'; // Your utility function using getServerSession
import DashboardContent, { ClientSafeMessage } from './dashboard-content';
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from 'next/server';


export default async function DashboardPage() {
try {
     await dbConnect();
    
    const session = await getAuthSession(); 
  
    if (!session || !session.user || !session.user.email) {
      console.log("User not logged in");
      return redirect('/signin');
      
    }
   const userEmail = session?.user.email
    const user = await UserModel.findOne({ email: userEmail })
    .select('username isAcceptingMessage messages')
    .lean() as any;
    if (!user) {
      redirect('/signin');
  
    }

    const serializedMessages: ClientSafeMessage[] = (user.messages || []).map(msg => {
            // Guarantee that every property is a primitive string.
            return {
                _id: String(msg._id),
                content: msg.content,
                // Ensure the Date object is converted to a string format (e.g., ISO string)
                createdAt: (msg.createdAt as Date).toISOString(), 
            } as ClientSafeMessage; 
        });
  
    const plainUserObject = JSON.parse(JSON.stringify(user));
    const fetchedUsername = plainUserObject.username;
    const isMessageAccepting = plainUserObject.isAcceptingMessage // example
    const initialMessages = serializedMessages; // example


  // 4. Pass the guaranteed data to the Client Component
  return (
    <DashboardContent
      username={fetchedUsername} // Passed as a prop
      initialMessages={initialMessages}
      initialAcceptStatus={isMessageAccepting}
    />
  );
}catch (error) {
  console.error("Error fetching user data:", error);
  return NextResponse.json(
    { success: false, message: "Error fetching user data" },
    { status: 500 }
  );
}
}




















