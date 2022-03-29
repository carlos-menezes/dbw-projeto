import { Question } from '@prisma/client';

type QuestionAllResponse = {
  questions?: Question[];
  error?: string;
};

export default QuestionAllResponse;
