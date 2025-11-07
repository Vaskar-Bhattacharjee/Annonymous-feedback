
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth'; // Your utility function using getServerSession
import DashboardContent from './dashboard-content';
import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export const dynamic = 'force-dynamic';
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

    const serializedMessages: Message[] = (user.messages || []).map(msg => {
            // Guarantee that every property is a primitive string.
            return {
                _id: String(msg._id),
                content: msg.content,
                // Ensure the Date object is converted to a string format (e.g., ISO string)
                createdAt: (msg.createdAt as Date).toISOString(), 
            } ; 
        });
  
    const fetchedUsername = user.username;
    const isMessageAccepting =  user.isAcceptingMessage // example
    console.log("isMessageAccepting",isMessageAccepting)
    const initialMessages = serializedMessages; // example


  // 4. Pass the guaranteed data to the Client Component
  return (
    <DashboardContent
      key={String(isMessageAccepting)}
      username={fetchedUsername} // Passed as a prop
      initialMessages={initialMessages}
      initialAcceptStatus={isMessageAccepting}
    />
  );
}catch (error) {
  console.error("Error fetching user data:", error);
  if (isRedirectError(error)) {
        throw error;
    }
  
  return (
      <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-red-500">
              Error loading dashboard. Please try again.
          </p>
      </div>
    );
}
}




















