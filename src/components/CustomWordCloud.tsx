'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import WordCloud from 'react-d3-cloud'

interface Props {}

const data = [
    {
        text: "hello",
        value: 4
    },
    {
        text: "new",
        value: 8
    },
    {
        text: "world",
        value: 19
    }
]

const fontSizeMapper = (word: {value: number}) => {
    return Math.log2(word.value) * 5 + 16;
}

const CustomWordCloud = (props: Props) => {
    const theme = useTheme();
    return (
        <div>
            <WordCloud 
                height={550}
                data={data}
                font={'Times'}
                rotate={0}
                fontSize={fontSizeMapper}
                padding={10}
                fill={theme.theme == 'dark' ? 'white' : 'black'}  />
        </div>
    )
}

export default CustomWordCloud;