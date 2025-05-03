import keyword_extractor from 'keyword-extractor';
import { useMemo } from 'react';

type Props = {
    answer: string
}

const BlankAnswerInput = ({ answer }: Props) => {
    const keywords = useMemo(() => {
        const words = keyword_extractor.extract(answer, {
            language: "en",
            remove_digits: true,
            return_changed_case: false,
            remove_duplicates: false
        });

        console.log(words);
    }, [answer])

    return (
        <div className="flex justify-start w-full mt-4">
            <h1 className="text-xl font-semibold">
                {answer}
            </h1>
        </div>
    )
}

export default BlankAnswerInput;