"use client"

import {
    DropdownMenu,
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";  
import { redirect } from "next/navigation";

type Props = {
    user: Pick<User, 'name' | 'email' | 'image'>
}

const UserAccountNav = ({ user }: Props) => {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user} />                   
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white border rounded-lg border-gray-200 shadow-md flex flex-col justify-evenly" align="end">
                <div className="flex items-center justify-start gap-2 p-3">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">
                            {user.name}
                        </p>}
                        {user.email && <p className="width-[200px] truncate text-sm text-zinc-700">
                            {user.email}    
                        </p>}
                    </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-1 m-1">
                    <Link href={'/'}>meow</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                    e.preventDefault();
                    signOut().catch(console.error);
                }} className="flex flex-row text-red-500 cursor-pointer p-1 m-1 focus:outline-none">
                    Sign Out
                    <LogOut className="w-4 h-4 ml-1 mt-1" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserAccountNav;