import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API
});

interface OutputFormat {
    [key: string]: string | string[] | OutputFormat;
}

interface ReturnFormat {
    question: string,
    answer: string
}

export async function generate_open_ended(
    amount: string,
    topic: string
) {
    const system_prompt = `You are a helpful AI that is able to generate exactly ${amount} pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array`
    const user_prompt = `You are to generate a random hard open-ended questions about ${topic}`
    const output_instructions = `Do not put quotation marks or escape character in the output fields. If output field is a list, classify output into the best element of the list. Any text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden. Any output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}. Generate a list of json, one json for each input element.`
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: system_prompt + output_instructions
            },
            {
                role: "user",
                content: user_prompt
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "outuput_schema",
                description: "output schema for open-ended question",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: {
                                        type: "string",
                                        description: "question"
                                    },
                                    answer: {
                                        type: "string",
                                        description: "answer with max length of 15 words"
                                    }
                                }, 
                                required: ["question", "answer"],
                                "additionalProperties": false
                            }
                        }
                    },
                    required: ["questions"],
                    "additionalProperties": false
                }
            }
        }
    });
    
    return response.choices[0].message.content
}

export async function generate_mcq(topic: string) {
    const system_prompt = "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array, in case of keywords only based options do not explain the answer just give the correct keyword as the answer"
    const user_prompt = `You are to generate a random hard mcq questions about ${topic}`
    const output_instructions = `Do not put quotation marks or escape character in the output fields. If output field is a list, classify output into the best element of the list. Any text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden. Any output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}. Generate a list of json, one json for each input element.`
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: system_prompt + output_instructions
            }, {
                role: "user",
                content: user_prompt 
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "output_schema",
                description: "output schema for mcq questions",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: {
                                        type: "string",
                                        description: "question"
                                    },
                                    answer: {
                                        type: "string",
                                        description: "answer with max length of 15 words"
                                    },
                                    option1: {
                                        type: "string",
                                        description: "option1 with max length of 15 words"
                                    },
                                    option2: {
                                        type: "string",
                                        description: "option2 with max length of 15 words"
                                    },
                                    option3: {
                                        type: "string",
                                        description: "option3 with max length of 15 words"
                                    }
                                },
                                required: ["question", "answer", "option1", "option2", "option3"],
                                "additionalProperties": false
                            }
                        }
                    },
                    required: ["questions"],
                    "additionalProperties": false
                }
            } 
        }
    });
    
    return response.choices[0].message.content
}
