import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { QuizCreationSchema } from "@/schemas/form/quiz";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    const { topic, type, amount } = QuizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_URL as string}/api/questions`,
      {
        amount,
        topic,
        type,
      }
    );

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: options,
          gameId: game.id,
          questionType: "mcq",
        };
      });

      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };
      await prisma.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          };
        }),
      });
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}