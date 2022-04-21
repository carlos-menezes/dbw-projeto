import { Category, Question } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useEffect, useState } from 'react';
import DefaultErrorPage from 'next/error';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  Column,
  Form,
  InlineNotification,
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
import FlexColumn from '../../../components/FlexColumn';
import { api } from '../../../services/api';
import QuestionUpdateResponse from '../../api/question/types/QuestionUpdateResponse';
import QuestionUpdateRequest from '../../api/question/types/QuestionUpdateRequest';
import Router from 'next/router';
import { AxiosError } from 'axios';

const EditQuestionForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 20px;
`;

type EditQuestionProps = {
  question: Question | null;
  categories: Category[] | null;
};

const EditQuestion: React.FC<EditQuestionProps> = ({
  question,
  categories
}) => {
  const [questionData, setQuestionData] = useState<Omit<Question, 'id'> | null>(
    {
      title: question.title,
      description: question.description,
      pinned: question.pinned,
      categoryId: question.categoryId
    }
  );
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .put<QuestionUpdateResponse>('/api/question/update', {
        id: question.id,
        data: questionData
      } as QuestionUpdateRequest)
      .then((_) => {
        Router.push('/faq');
      })
      .catch((err: AxiosError) => {
        setError(err.response?.data.error);
      });
  };

  return questionData === null ? (
    <DefaultErrorPage statusCode={404} />
  ) : (
    <Layout title={`Question #${question.id}`}>
      <Grid>
        <Row>
          <FlexHeading>
            <h1>Question</h1>
          </FlexHeading>
        </Row>

        <Divider margin={10} />

        <EditQuestionForm
          onSubmit={(e: FormEvent<HTMLFormElement>) => handleFormSubmission(e)}
        >
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
            <FlexColumn>
              <Checkbox
                height={'100%'}
                title="Pinned"
                checked={questionData.pinned}
                id={'Pinned'}
                labelText={'Pinned'}
                onClick={() => {
                  setQuestionData((state) => ({
                    ...state,
                    pinned: !state.pinned
                  }));
                }}
              />
            </FlexColumn>
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
          <Row>
            <Column>
              <Button kind="primary" type="submit">
                Submit
              </Button>
            </Column>
          </Row>
        </EditQuestionForm>
        {error && (
          <Row>
            <Column>
              <InlineNotification
                kind={'error'}
                title={'Error'}
                subtitle={error}
              />
            </Column>
          </Row>
        )}
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
