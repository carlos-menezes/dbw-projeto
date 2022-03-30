import { Question } from '@prisma/client';

type QuestionUpdateRequest = {
  id: string;
  data: Question;
};

export default QuestionUpdateRequest;
