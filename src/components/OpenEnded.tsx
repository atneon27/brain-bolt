"use client"
import { Game, Question } from '@prisma/client';
import { ChevronLeft, ChevronRight, Timer, BarChart} from 'lucide-react';
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import MCQCounter from './MCQCounter';
import axios from 'axios';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { CheckAnswerSchema } from '@/schemas/form/quiz';
import { useToast } from '@/hooks/use-toast';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns'

type Props = {
    game: Game & {Question: Pick<Question, "id" | "question" | "answer">[]}
};

const OpenEnded = ({ game }: Props) => {
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [hasEnded, setHasEnded] = useState<boolean>(false);
    const [now, setNow] = useState<Date>(new Date());

    const { toast } = useToast();

    useEffect(() => {
        const interval = setInterval(() => {
            if(!hasEnded) {
                setNow(new Date());
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [hasEnded])

    const currentQuestion = useMemo(() => {
        return game.Question[questionIndex]
    }, [questionIndex, game.Question]);

    const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
        mutationFn: async () => {
            const payload: z.infer<typeof CheckAnswerSchema> = {
                questionId: currentQuestion.id,
                userAnswer: ""
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/checkAnswer`, payload);
            return response.data;
        }
    });

     const handleNext = useCallback(() => {
        if(isChecking) return;
        checkAnswer(
            undefined,
            {
                onSuccess: ({percentageCorrect}) => {
                    toast({
                        title: `Your answer is ${percentageCorrect ?? 0}% similar to the correct answer`,
                        description: "Mathced on the basis of similarity"
                    })
                    if(questionIndex == game.Question.length-1) {                        
                        setHasEnded(true);
                        return;
                    }
                    setQuestionIndex(prev => prev + 1);
                }
            }
        )
    }, [checkAnswer, toast, isChecking])

    return (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                    <p>
                        <span className="text-slate-400 font-semibold">Topic</span>
                        <span className="ml-2 px-2 py-1 rounded-lg text-white bg-slate-800 font-semibold">{game.topic}</span>
                    </p>
                    <div className="flex self-start mt-3 text-slate-400">
                        <Timer className='mr-2'/>
                        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                    </div>
                </div>
                
            </div>
            
            <Card className='w-full mt-4'>
                <CardHeader className='flex flex-row items-center'>
                    <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
                        <div>{questionIndex + 1}</div>
                        <div className="text-base text-slate-400">{game.Question.length}</div>
                    </CardTitle>
                    <CardDescription className='flex-grow text-lg'>
                        {currentQuestion.question}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex flex-col items-center justify-center w-full mt-4">
                
            </div>

            <div className='flex flex-row justify-start gap-4'>
                {(questionIndex != 0) ? <Button
                    disabled={isChecking || hasEnded} 
                    onClick={() => {
                        setQuestionIndex(questionIndex - 1);
                    }}>
                        Previous
                        <ChevronLeft className='w-4 h-4 mr-2'/>
                </Button> : ''}
                {(questionIndex != game.Question.length-1) ? <Button
                    disabled={isChecking} 
                    onClick={() => {
                        handleNext();
                        setQuestionIndex(questionIndex + 1);
                    }}>
                        Next
                        <ChevronRight className='w-4 h-4 ml-2'/>
                    </Button> : <Button 
                        disabled={isChecking || hasEnded}
                        onClick={() => {
                            handleNext();
                            setHasEnded(true);
                        }}>
                            Submit
                    </Button>}
            </div>
        </div>
    )
}

export default OpenEnded;