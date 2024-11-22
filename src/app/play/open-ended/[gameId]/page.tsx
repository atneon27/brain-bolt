import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
    params: {
        gameId: string
    }
}

const OpenEndedPage = async ({params: {gameId}}: Props) => {
    const session = await getAuthSession();
    if(!session?.user) {
        return redirect('/');
    }

    return (
        <div>
            {gameId}
            This is the game Id which will be displayed on the page
        </div>
    )
}

export default OpenEndedPage;