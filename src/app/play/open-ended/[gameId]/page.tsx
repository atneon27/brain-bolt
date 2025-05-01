import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import OpenEnded from '@/components/OpenEnded';
import React from 'react'

interface Props {
    params: {
        gameId: string
    }
}

const OpenEndedPage = async ({params }: Props) => {
    const { gameId } = await params;

    const session = await getAuthSession();
    if(!session?.user) {
        return redirect('/');
    }

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        },
        include: {
            Question: {
                select: {
                    id: true,
                    question: true,
                    answer: true
                }
            }
        }
    });

    if(!game || game.gameType != 'open_ended') {
        return redirect('/');
    }

    return (
        <OpenEnded game={game} /> 
    )
}

export default OpenEndedPage;