'use client'

import React from 'react'
import axios from 'axios'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle,  } from '../ui/card'
import { useForm } from 'react-hook-form'
import { QuizCreationSchema } from '@/schemas/form/quiz'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from '../ui/separator'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'



interface Props {}
type Input = z.infer<typeof QuizCreationSchema>;

export const QuizCreation = (props: Props) => {
    const router = useRouter();

    const {mutate: getQuestions, isLoading} = useMutation({
        mutationFn: async ({ amount, type, topic }: Input) => { 
            const response = await axios.post(`http://localhost:3000/api/game`, {
                amount,
                topic,
                type
            })

            console.log(response.data)
            return response.data
        }
    })

    const form = useForm<Input>({
        resolver: zodResolver(QuizCreationSchema),
        defaultValues: {
            amount: 3,
            topic: "",
            type: "mcq",
        }
    });

    const onSubmit = (input: Input) => {
        getQuestions({
            amount: input.amount,
            topic: input.topic,
            type: input.type
        }, {
            onSuccess: ({gameId}) => {
                if(form.getValues('type') === 'mcq') {
                    router.push(`/play/mcq/${gameId}`)
                } else {
                    router.push(`/play/open-ended/${gameId}`)
                }
            }
        })
    };

    form.watch();

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
           <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Quiz Creation</CardTitle>
                    <CardDescription>Choose a topic</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a topic..." {...field} />
                                </FormControl>
                                <FormDescription>   
                                    Please provide any topic you would like to be quizzed upon here
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Number of Question</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter an Amount" 
                                        {...field}
                                        onChange={(e) => {
                                            form.setValue('amount', parseInt(e.target.value));
                                        }}
                                        type='number'
                                        max={10}
                                        min={1}
                                    />
                                </FormControl>
                                <FormDescription>
                                    You can choose how many questions you would like to be quizzed upon here 
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex items-center">
                                <Button 
                                    type='button'
                                    className='w-1/2 rounded-none rounded-l-lg'
                                    variant={form.getValues('type') === 'mcq' ? 'default' : 'secondary'}
                                    onClick={() => {
                                        form.setValue('type', 'mcq')
                                    }}
                                >
                                    <CopyCheck className='w-4 h-4 mr-2' /> Multiple Choice
                                </Button>
                                <Separator orientation='vertical'/>
                                <Button 
                                    type='button'
                                    className='w-1/2 rounded-none rounded-r-lg'
                                    variant={form.getValues('type') === 'open_ended' ? 'default' : 'secondary'}
                                    onClick={() => {
                                        form.setValue('type', 'open_ended')
                                    }}
                                >
                                    <BookOpen className='w-4 h-4 mr-2' /> Open Ended
                                </Button>
                            </div>
                            <Button disabled={isLoading} type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card> 
        </div>
    )
}
