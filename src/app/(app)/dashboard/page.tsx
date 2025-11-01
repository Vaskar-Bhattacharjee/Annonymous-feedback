
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth'; // Your utility function using getServerSession
import DashboardContent from './dashboard-content';
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from 'next/server';


export default async function DashboardPage() {
try {
    dbConnect();
    const session = await getAuthSession(); 
  
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
      console.log('session not found')
    }
   const userEmail = session?.user.email
    const user = await UserModel.findOne({ email: userEmail });
    user.lean();
    if (!user) {
      redirect('/signin');
  
    }
  
    const plainUserObject = JSON.parse(JSON.stringify(user));
    const fetchedUsername = plainUserObject.username;
    const isMessageAccepting = plainUserObject.isAcceptingMessage // example
    const initialMessages = plainUserObject.messages; // example


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




















