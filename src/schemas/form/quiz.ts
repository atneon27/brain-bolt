import { z } from 'zod';

export const QuizCreationSchema = z.object({
    topic: z.string().min(4, {message: "Topic must be 4 characters long!"}).max(50, {message: "Topic exceeds permissable word limit!"}),
    type: z.enum(['mcq', 'open_ended']),
    amount: z.number().min(1).max(10),
});

export const CheckAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string()
});
