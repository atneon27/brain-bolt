import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface Props {}

export const RecentActivityCard = (props: Props) => {
    return (
        <Card className='col-span-4 lg:col-span-3'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Recent Activities</CardTitle>
                <CardDescription>
                    You have played a total of 43 quizzes.
                </CardDescription>
            </CardHeader>

            <CardContent className='max-h-[580px] overflow-scroll'>
                Histories
            </CardContent>
        </Card>
    )
}
