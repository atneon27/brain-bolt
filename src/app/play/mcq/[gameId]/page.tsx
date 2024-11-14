import MCQ from '@/components/MCQ';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
    params: {
        gameId: string
    }
}

const MCQPage = async ({params }: Props) => {
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
                    options: true
                }
            }
        }
    });

    if(!game || game.gameType != 'mcq') {
        return redirect('/');
    }

    return (
        <MCQ game={game} />
    )
}

export default MCQPage;