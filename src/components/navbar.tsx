"use client";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertTriangle, Loader2, LogOut, UserX } from "lucide-react";

export function Navbar() {
    const { data: session } = useSession();
    const [actionToConfirm, setActionToConfirm] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const user = session?.user as User;
    const username = user?.username;

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


    return (
        <AlertDialog>
        <nav className=" p-4 bg-black text-white">
            <div className="flex items-center justify-between  mx-4 sm:mx-10 md:mx-9 lg:mx-27">
                <a 
                className="font-semibold text-xl tracking-tight hover:underline cursor-pointer
                "
                href="#">Mystery Chat</a>
                
                    
                    
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
                    
                
           </div> 
        </nav>


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