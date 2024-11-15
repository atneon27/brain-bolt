"use client"
import { Game, Question } from '@prisma/client';
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import MCQCounter from './MCQCounter';

interface Props {
    game: Game & { Question: Pick<Question, "id" | "options" | "question">[] } 
}

const MCQ = ({game}: Props) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(0);
    
    const currentQuestion = useMemo(() => {
        return game.Question[questionIndex]
    }, [questionIndex, game.Question]);

    const options = useMemo(() => {
        if(!currentQuestion) return [];
        if(!currentQuestion.options) return [];
        
        // can cause problems - look out
        return currentQuestion.options;
    }, [currentQuestion])

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
                        <span>00.00</span>
                    </div>
                </div>
                <MCQCounter correctAnswers={2} wrongAnswers={3}/>
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
                {options.map((opt, idx) => {
                    return (
                        <Button 
                            key={idx} 
                            className='justify-start py-8 mb-4 w-full' 
                            type='button' 
                            variant={selectedChoice === idx ? 'default' : 'secondary'}
                            onClick={() => {
                                setSelectedChoice(idx);
                            }}>
                            <div className="flex items-center justify-start">
                                <div className='p-2 mx-2 mr-5 border rounded-md'>{idx+1}</div>
                                <div className="text-start">{opt}</div>
                            </div>
                        </Button>
                    )
                })}
            </div>

            <div className='flex flex-row justify-start gap-4'>
                {(questionIndex != 0) ? <Button onClick={() => {
                    setQuestionIndex(questionIndex - 1);
                }}>
                    Previous
                    <ChevronLeft className='w-4 h-4 mr-2'/>
                </Button> : ''}
                {(questionIndex != game.Question.length-1) ? <Button onClick={() => {
                    setQuestionIndex(questionIndex + 1);
                }}>
                    Next
                    <ChevronRight className='w-4 h-4 ml-2'/>
                </Button> : ''}
            </div>
        </div>
    )
}

export default MCQ;