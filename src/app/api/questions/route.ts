import { generate_mcq, generate_open_ended } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { QuizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const { amount, topic, type } = QuizCreationSchema.parse(body);
    let questions: any;
    if (type === "open_ended") {
      const data = await generate_open_ended(amount, topic)
      questions =  data?.questions   
    } else if (type === "mcq") {
      const data = await generate_mcq(amount, topic)
      questions = data?.questions
    }
    
    return NextResponse.json(
      {
        questions: questions,
        amt: amount
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}