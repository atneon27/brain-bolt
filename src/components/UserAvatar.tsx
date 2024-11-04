import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = {
    user: Partial<Pick<User, 'name' | 'image'>>
}

const UserAvatar = ({ user }: Props) => {
    return(
        <Avatar>
            {user?.image ? (
                <div className="relative w-full h-full aspect-square">
                    <Image fill src={user?.image} alt="profile image" referrerPolicy="no-referrer"  />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">
                        {user?.name}
                    </span>
                </AvatarFallback>
            )}
        </Avatar>
    )   
}

export default UserAvatar;
