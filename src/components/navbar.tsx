"use client";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

export function Navbar() {
    const { data: session } = useSession();
    console.log(session);
    const user = session?.user as User;
    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white">
            
                <a 
                className="font-semibold text-xl tracking-tight hover:underline cursor-pointer
                "
                href="#">Mystery Chat</a>
                
                    
                    
                       {
                         session? (
                            <div className="flex items-center gap-3">
                            <span>welcome {user.name || user.email}</span>
                            <Button onClick ={() => signOut()}>Sign Out</Button>
                            </div>
                           
                        ) : (
                            <Link
                            className="text-amber-400 hover:underline"
                            href="/signin">Sign In</Link>
                        )
                       }
                    
                
            
        </nav>
    )
    
}