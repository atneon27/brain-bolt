
import { QuizCreation } from '@/components/quiz/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import { title } from 'process';
import React from 'react'

export const metadata = {
    title: "BrainBolt | Quiz"
}

const QuizPage = async () => {
    const session = await getAuthSession();
    if(!session?.user) {
        redirect('/')
    }

    return <QuizCreation />
}

export default QuizPage;
