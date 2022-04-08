import { Category, Question } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useEffect, useState } from 'react';
import DefaultErrorPage from 'next/error';
import styled from 'styled-components';
import {
  Column,
  Form,
  Row,
  Select,
  SelectItem,
  TextArea,
  TextInput
} from 'carbon-components-react';

import { AUTH_TOKEN } from '../../../utils/constants';
import { prisma } from '../../../services/db';
import Layout from '../../../components/Layout';
import Grid from '../../../components/Grid';
import FlexHeading from '../../../components/FlexHeading';
import Divider from '../../../components/Divider';

const EditQuestionForm = styled(Form)`
  display: 'flex';
  flex-direction: 'column';
  justify-content: 'flex-start';
  row-gap: '20px';
`;

type EditQuestionProps = {
  question: Question | null;
  categories: Category[] | null;
};

const EditQuestion: React.FC<EditQuestionProps> = ({
  question,
  categories
}) => {
  const [questionData, setQuestionData] = useState<Question | null>(question);
  const [categoriesData, setCategoriesData] = useState<Category[] | null>(
    categories
  );

  useEffect(() => {
    console.log(questionData);
  }, [questionData]);

  const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {};

  return questionData === null ? (
    <DefaultErrorPage statusCode={404} />
  ) : (
    <Layout title={`Question #${questionData?.id}`}>
      <Grid>
        <Row>
          <FlexHeading>
            <h1>Question</h1>
          </FlexHeading>
        </Row>

        <Divider margin={10} />

        <EditQuestionForm onSubmit={(e) => handleFormSubmission(e)}>
          <Row>
            <Column>
              <TextInput
                defaultValue={questionData.title}
                id={'questionTitle'}
                labelText={'Title'}
                required
                onChange={(e) =>
                  setQuestionData((state) => ({
                    ...state,
                    title: e.target.value
                  }))
                }
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Select
                labelText={'Category'}
                id={'category'}
                defaultValue={
                  categories.filter((c) => c.id === question.categoryId)[0].id
                }
                onChange={(e) => {
                  setQuestionData((state) => ({
                    ...state,
                    categoryId: e.target.value
                  }));
                }}
              >
                {categories.map((cat) => (
                  <SelectItem
                    id={cat.id}
                    key={cat.id}
                    text={cat.title}
                    value={cat.id}
                  />
                ))}
              </Select>
            </Column>
          </Row>
          <Row>
            <Column>
              <TextArea
                required
                labelText={'Description'}
                defaultValue={questionData.description}
                onChange={(e) => {
                  setQuestionData((state) => ({
                    ...state,
                    description: e.target.value
                  }));
                }}
              />
            </Column>
          </Row>
        </EditQuestionForm>
      </Grid>
    </Layout>
  );
};

export default EditQuestion;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { [AUTH_TOKEN]: token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  const id = context.params.id as string;

  try {
    const question = await prisma.question.findUnique({
      where: {
        id
      }
    });

    const categories = await prisma.category.findMany();

    if (!question || !categories) {
      return {
        props: {
          question: null,
          categories: null
        }
      };
    }

    return {
      props: {
        question,
        categories
      }
    };
  } catch (error) {
    return {
      props: {}
    };
  }
};
